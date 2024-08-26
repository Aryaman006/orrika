"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useCart } from '../context/cartContext';

const Add = ({ name, selectedVariant, imageUrl, productId }) => {
  const [quantity, setQuantity] = useState(1);
  const {cart, setCart} = useCart(); // Destructure cart and setCart from useCart

  useEffect(() => {
    setQuantity(1); // Reset quantity when selectedVariant changes
  }, [selectedVariant]);

  const stock = selectedVariant ? selectedVariant.stock : 0;
  const price = selectedVariant ? selectedVariant.price : 0;

  const handleQuantity = (type) => {
    if (type === "d" && quantity > 1) {
      setQuantity(quantity - 1);
    }
    if (type === "i" && quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a variant before adding to cart.');
      return;
    }

    // Create the new cart item
    const newCartItem = {
      productId,
      name,
      price,
      quantity,
      variant: selectedVariant,
      imageUrl
    };

    // Update the cart state
    const updatedCart = [...cart, newCartItem];
    setCart(updatedCart);

    // Save updated cart to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast.success('Product added to cart!');
      } catch (error) {
        toast.error('Failed to add product to cart.');
      }
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button
              className='cursor-pointer text-xl'
              onClick={() => handleQuantity("d")}
              disabled={quantity <= 1}
            >
              -
            </button>
            {quantity}
            <button
              className='cursor-pointer text-xl'
              onClick={() => handleQuantity("i")}
              disabled={quantity >= stock}
            >
              +
            </button>
          </div>
          <div className="text-xs">
            {selectedVariant ? (
              <>
                Only <span className='text-orange-500'>{stock} items</span> left! <br /> {"Don't miss it"}
              </>
            ) : (
              "Please select a color and size."
            )}
          </div>
        </div>
        <button
          className="w-36 text-sm rounded-3xl ring-1 ring-[#F35C7A] text-[#F35C7A] py-2 px-4 hover:bg-[#F35C7A] hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none"
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default Add;
