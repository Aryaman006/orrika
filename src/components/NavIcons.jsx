"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import CartModel from './CartModel';
import { account } from '../context/appwrite';
import { toast } from 'react-toastify';

const NavIcons = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin status
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setLoggedIn(!!user);

        // Assuming user object has a role property to check admin status
        setIsAdmin(user.labels.includes('admin'));
      } catch (error) {
        toast.error("Error fetching user:", error);
        setLoggedIn(false);
      } finally {
        setIsLoading(false); // Loading complete
      }
    };

    fetchUser();
  }, []);

  const handleProfile = () => {
    if (!loggedIn) {
      router.push("/login");
    } else {
      if (isAdmin) {
        router.push("/admin"); // Navigate to admin page if user is admin
      } else {
        router.push("/profile");
      }
    }
  };

  const handleCartClick = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <div className='flex items-center gap-4 xl:gap-6 relative'>
      {isLoading ? (
        <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
      ) : (
        <Image 
          src="/profile.png" 
          height={22} 
          width={22} 
          className='cursor-pointer' 
          onClick={handleProfile} 
          alt="Profile" 
        />
      )}
      <div 
        className="relative cursor-pointer" 
        onClick={handleCartClick}
      >
        <Image 
          src="/cart.png" 
          height={22} 
          width={22} 
          className='cursor-pointer' 
          alt="Cart"
        />
        <div 
          className="absolute -top-4 -right-4 w-6 h-6 bg-[#F35C7A] rounded-full text-white text-sm flex items-center justify-center"
        >
          2
        </div>
      </div>

      {isCartOpen && <CartModel closeCart={() => setIsCartOpen(false)} />}
    </div>
  );
};

export default NavIcons;
