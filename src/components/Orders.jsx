"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'timeago.js';
import { account, databases, Query } from '../context/appwrite';
import { toast } from 'react-toastify';

const Orders = ({ onBack }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = await account.get();
        const ordersList = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_ORDERS_ID,
          [Query.equal('user', user.$id)]
        );

        const parseOrders = ordersList.documents.map(order => ({
          ...order,
          products: order.products.map(product => JSON.parse(product))
        }));
console.log("parse",parseOrders);

        setOrders(parseOrders);
        setFilteredOrders(parseOrders);
      } catch (error) {
        toast.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, minPrice, maxPrice]);

  const applyFilters = () => {
    let filtered = [...orders];

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (minPrice) {
      filtered = filtered.filter((order) => order.totalPrice >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((order) => order.totalPrice <= parseFloat(maxPrice));
    }

    setFilteredOrders(filtered);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 " style={{minHeight:"100vh"}}>
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-md"
      >
        Back to Dashboard
      </button>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Orders</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="p-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="p-2 border rounded-md"
        />
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Apply Filters
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.$id}
              className="p-4 border rounded-md shadow-sm flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <span className="font-semibold">Order ID: {order.$id?.substring(0, 10)}...</span>
                <span className="text-gray-600">Total: ${order.totalPrice}</span>
                <span className="text-sm text-gray-500">
                  {format(new Date(order.$createdAt))}
                </span>
                <span className={`status-${order.status.toLowerCase()} text-sm font-medium`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-4 sm:mt-0">
                {order.products?.length > 0 ? (
                  order.products.map((product, index) => (
                    <Link
                      href={`/products/${product.productId}`}
                      key={`${product.productId}-${index}`}
                      className="block p-2 border rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <span className="font-medium">{product.name}</span>
                          <span className="block text-gray-600">${product.price}</span>
                          <span className="block text-gray-600">
                            Color: {product.color}, Size: {product.size}, Quantity: {product.quantity}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-gray-500">No products found for this order.</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default Orders;
