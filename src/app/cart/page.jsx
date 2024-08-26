"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { databases, account, Query } from '../../context/appwrite';
import { useCart } from '../../context/cartContext';
import { toast } from 'react-toastify'; // Import toast
import emptyCartImage from '../../../public/emptyBag.jpg';
import Loading from "../../components/Loading";

const CartPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // Default payment method
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  const { cart, setCart } = useCart();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await account.get();
        setUser(userData);

        // Fetch the user's saved addresses
        const addressList = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_ADDRESSES_ID,
          [Query.equal('userId', userData.$id)]
        );
        setAddresses(addressList.documents);
        if (addressList.documents.length > 0) {
          setSelectedAddress(addressList.documents[0]); // Set the default selected address
        }
      } catch (error) {
        toast.error("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productDetails = await Promise.all(
          cart.map(item =>
            databases.getDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
              process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID,
              item.productId
            )
          )
        );
        setProducts(productDetails);
      } catch (error) {
        toast.error("Failed to fetch product details.");
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (cart.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [cart]);

  const handleRemove = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleShopNavigation = () => {
    router.push('/list');
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleAddressChange = (address) => {
    setSelectedAddress(address);
  };

  const handleAddressRedirect = () => {
    toast.error("Please add an address before proceeding.");
    router.push('/profile');
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePlaceOrder = async () => {
    try {
      if (paymentMethod === 'razorpay') {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onerror = () => toast.error("Razorpay SDK failed to load. Are you online?");
        script.onload = async () => {
          try {
            const result = await fetch('/api/razorpay', {
              method: 'POST',
              body: JSON.stringify({
                cart,
                totalAmount: total,
                shippingAddress: selectedAddress
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            });
  
            const data = await result.json();
            const options = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
              currency: data.currency,
              amount: data.amount,
              order_id: data.id,
              name: 'FAVINDO',
              description: 'Thank you for your purchase',
              image: '/FAVINDO.png',
              handler: async function (response) {
                const verificationResponse = await fetch('/api/verifyPayment', {
                  method: 'POST',
                  body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    user: user.$id,
                    products: cart,
                    total,
                    shippingAddress: selectedAddress
                  }),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                const verificationData = await verificationResponse.json();
                if (verificationData.status === 'success') {
                  toast.success("Payment successful");
                  setCart([]);
                  localStorage.setItem('cart', JSON.stringify([]));
                } else {
                  toast.error("Payment failed or incomplete.");
                }
              },
              prefill: {
                name: user ? user.name : '',
                email: user ? user.email : '',
                contact: user ? user.phone : '',
              },
              theme: {
                color: '#212121',
                logo: '/FAVINDO.png',
              },
            };
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
          } catch (error) {
            toast.error("Something went wrong. Please try again later.");
          }
        };
        document.body.appendChild(script);
      } else if (paymentMethod === 'cod') {
        const response = await fetch('/api/placeOrder', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.$id,
            cart,
            total,
            shippingAddress: selectedAddress,
            paymentMethod: 'cod'
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok && data.status === 'success') {
          toast.success("Order placed successfully using Cash on Delivery");
          setCart([]);
          localStorage.setItem('cart', JSON.stringify([]));
        } else {
          toast.error("Failed to place the order. Please try again.");
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };
  
  const handleConfirmModal = (callback) => {
    setShowConfirmModal(true);
    callback();
  };

  const handleConfirm = () => {
    handlePlaceOrder();
    setShowConfirmModal(false);
  };
  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <Image src={emptyCartImage} alt="Empty Shopping Bag" width={200} height={200} />
          <h2 className="text-xl font-medium">Your shopping bag is empty</h2>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleShopNavigation}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-medium mb-4">Shopping cart ({cart.length} item{cart.length > 1 ? 's' : ''})</h2>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              {products.map((product, index) => (
                cart[index] && (
                  <div key={index} className="flex items-center gap-4 border-b pb-4 mb-4">
                    <Image
                      src={product.post[0]}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-lg font-medium">{product.name}</h3>
                      <p className="text-gray-500">₹{cart[index].price}</p>
                      <p className="text-gray-500">You saved ₹{product.mrp - cart[index].price}</p>
                      <div className="flex items-center gap-2">
                        <span>Color: {cart[index].variant.color}</span>
                        <span>Size: {cart[index].variant.size}</span>
                        <span>Qty: {cart[index].quantity}</span>
                      </div>
                    </div>
                    <button
                      className="text-red-500"
                      onClick={() => handleRemove(cart[index].productId)}
                    >
                      Remove
                    </button>
                  </div>
                )
              ))}
            </div>
            <div className="w-full lg:w-1/3">
              <h3 className="text-lg font-medium mb-2">Order Summary</h3>
              <div className="bg-gray-100 p-4 rounded">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Total:</span>
                  <span>₹{total}</span>
                </div>
              </div>
              <div className="my-4">
                <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                {addresses.length > 0 ? (
                  <select
                    value={selectedAddress ? selectedAddress.$id : ''}
                    onChange={(e) => handleAddressChange(addresses.find(address => address.$id === e.target.value))}
                    className="w-full p-2 border rounded"
                  >
                    {addresses.map((address) => (
                      <option key={address.$id} value={address.$id}>
                        {`${address.name}, ${address.street}, ${address.city}, ${address.state} - ${address.zip}`}
                      </option>
                    ))}
                  </select>
                ) : (
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={handleAddressRedirect}
                  >
                    Add Address
                  </button>
                )}
              </div>
              <div className="my-4">
                <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                <div className="flex items-center gap-4">
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => handlePaymentMethodChange('razorpay')}
                    />
                    Razorpay
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => handlePaymentMethodChange('cod')}
                    />
                    Cash on Delivery
                  </label>
                </div>
              </div>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded w-full"
                onClick={handleConfirmModal}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Order Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg w-3/4 max-w-md">
            <h2 className="text-lg font-medium mb-4">Confirm Order</h2>
            <p>Are you sure you want to place the order?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-200 py-2 px-4 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
