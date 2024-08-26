import React, { useState, useEffect } from 'react';
import './order.css'; // Adjust the path as needed
import { toast } from 'react-toastify'; // Import toast


const OrderSummary = ({ selectedOrder, onClose }) => {
  const [user, setUser] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!selectedOrder) return;

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/fetch-users?userId=${selectedOrder.user}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        toast.error('Failed to fetch user details:', error);
      }
    };

    const calculateTotalPrice = (productDetails) => {
      const total = productDetails.reduce(
        (sum, product) => sum + parseFloat(product.price) * parseInt(product.quantity),
        0
      );
      setTotalPrice(total);
    };

    setProducts(selectedOrder.products || []);
    calculateTotalPrice(selectedOrder.products || []);

    fetchUserDetails();
  }, [selectedOrder]);

  if (!selectedOrder || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full relative printable-area">
        <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 no-print" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col items-center mb-8">
          <img src='/FAVINDO.png' alt="Company Logo" className="w-36 h-auto mb-4" />
          <h2 className="text-3xl font-bold">Invoice</h2>
        </div>
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Details</h3>
              <p><strong>Order ID:</strong> {selectedOrder.$id}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.$createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Products Ordered</h3>
          <div className="border-t border-gray-300">
            <ul className="divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <li key={product.$id} className="flex items-center justify-between py-4">
                    <div className="flex items-center">
                      <img src={product.image || '/placeholder.png'} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
                      <div className="ml-4">
                        <p className="font-semibold">{product.name}</p>
                        <p>Description: {product.description}</p>
                        <p>Price: ${product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Total: ${(parseFloat(product.price) * parseInt(product.quantity)).toFixed(2)}</p>
                    </div>
                  </li>
                ))
              ) : (
                <p>No products available.</p>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 pt-4">
          <h3 className="text-lg font-semibold mb-2">Total Price</h3>
          <p className="text-xl font-bold">${totalPrice.toFixed(2)}</p>
        </div>
        <div className="mt-6">
          <button onClick={() => window.print()} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors no-print">
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
