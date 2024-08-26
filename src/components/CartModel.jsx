"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import emptyCartImage from '../../public/emptyBag.jpg';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/cartContext'; // Adjust the import path as needed
import { account } from '../context/appwrite'; // Add import for account
import { toast } from 'react-toastify'; // Import toast

const CartModel = () => {
  const { cart, setCart } = useCart(); // Retrieve cart items from context
  const router = useRouter();
  const [user, setUser] = useState(null); 
  const [isVisible, setIsVisible] = useState(true); // Add state for modal visibility
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // Default payment method is Razorpay

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
      } catch (error) {
        toast.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  const handleShopNavigation = () => {
    router.push('/list');
    setIsVisible(false);
  };

  // Calculate subtotal
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleViewCart = () => {
    setIsVisible(false); // Close modal
    router.push('/cart');
  };

  const handleRemove = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart); // Update cart in context
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update cart in local storage
  };

  const loadRazorpay = async () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onerror = () => {
      toast.error('Razorpay SDK failed to load. Are you online?');
    };
    script.onload = async () => {
      try {
        const result = await fetch('/api/razorpay', {
          method: 'POST',
          body: JSON.stringify({
            cart,
            totalAmount: subtotal, // Total amount in rupees
            shippingAddress: 'Your Shipping Address Here' // Add actual shipping address
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await result.json();
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          currency: data.currency,
          amount: data.amount, // Amount in paise
          order_id: data.id,
          name: 'Your Company Name',
          description: 'Thank you for your purchase',
          handler: async function (response) {
            const verificationResponse = await fetch('/api/verifyPayment', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                user: user.$id, // Pass the actual user data
                products: cart,
                total: subtotal, // Total amount in rupees
                shippingAddress: "Your Shipping Address" // Pass the actual shipping address
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const verificationData = await verificationResponse.json();
            if (verificationData.status === 'success') {
              toast.success('Payment successful');
              setCart([]); // Clear the cart
              localStorage.setItem('cart', JSON.stringify([])); // Clear the cart in local storage
              setIsVisible(false); // Close modal
            } else {
              toast.error('Payment failed or incomplete');
            }
          },
          prefill: {
            name: user ? user.name : '',
            email: user ? user.email : '',
            contact: user ? user.phone : '', // You can fetch user contact info if available
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        toast.error('Something went wrong. Please try again later.');
      }
    };
    document.body.appendChild(script);
  };

  const handleCodPayment = async () => {
    try {
      const response = await fetch('/api/placeOrder', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.$id,
          cart,
          total: subtotal,
          shippingAddress: 'Your Shipping Address Here', // Add actual shipping address
          paymentMethod: 'cod'
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        toast.success('Order placed successfully using Cash on Delivery');
        setCart([]);
        localStorage.setItem('cart', JSON.stringify([]));
        setIsVisible(false); // Close modal
      } else {
        toast.error('Failed to place the order. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    }
  };

  if (!isVisible) return null; // Render nothing if modal is not visible

  return (
    <div className='w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[40vw] absolute p-4 rounded-md shadow-md bg-white top-12 right-0 flex flex-col gap-4 z-20 max-h-[80vh] overflow-auto'>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <Image src={emptyCartImage} alt="Empty Shopping Bag" width={200} height={200} />
          <h2 className="text-lg font-medium text-gray-700">Your shopping bag is empty</h2>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleShopNavigation}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <div className="flex flex-col gap-4">
            {cart.map((item, index) => (
              <div key={index} className="flex gap-4 items-center border-b pb-4 sm:ml-20">
                <Image
                  src={item.imageUrl || "/default-image.png"} // Ensure you have a fallback image
                  alt={item.name}
                  width={72}
                  height={96}
                  className='object-cover rounded-md '
                />
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center justify-between">
                    <h1 className='font-semibold'>{item.name}</h1>
                    <div className="p-1 bg-gray-100 rounded-md">₹{item.price}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.variant ? 'Available' : 'Out of stock'}
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className='text-gray-500'>Qty: {item.quantity}</span>
                    <button className='text-red-500' onClick={() => handleRemove(item.productId)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between font-semibold">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Payment Method</h4>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                    />
                    <span className="ml-2">Razorpay</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <span className="ml-2">Cash on Delivery</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button className="rounded-md py-2 px-4 ring-1 ring-gray-300" onClick={handleViewCart}>View Cart</button>
                {paymentMethod === 'razorpay' ? (
                  <button className="rounded-md py-2 px-4 bg-black text-white" onClick={loadRazorpay}>Checkout</button>
                ) : (
                  <button className="rounded-md py-2 px-4 bg-black text-white" onClick={handleCodPayment}>Place Order</button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModel;
