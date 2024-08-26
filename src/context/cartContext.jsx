"use client";
import React, { useState, useEffect, createContext, useContext } from 'react';

// Create the CartContext
const CartContext = createContext();

// CartProvider component
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
      // Load cart from localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
        }
      }
  }, []);


  const contextValue = {cart, setCart}


  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
const useCart = () => useContext(CartContext);

export { CartProvider, useCart };
