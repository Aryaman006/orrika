"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Menu from './Menu';
import Image from 'next/image';
import SearchBar from './SearchBar';
import NavIcons from './NavIcons';
import { toast } from 'react-toastify';
import { account } from '../context/appwrite';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = await account.get();
        setLoggedIn(!!user); // Set loggedIn to true if user exists, otherwise false
      } catch (error) {
        toast.error("Error fetching user session.");
      }
    };
    checkUserSession();
  }, []); // Empty dependency array to run only once on mount

  const handleLogOut = async () => {
    try {
      await account.deleteSession('current');
      setLoggedIn(false);
      router.push('/');
      window.location.reload(); // Force reload after logout
    } catch (error) {
      toast.error("Error logging out.");
    }
  };

  return (
    <div className='sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all md:p-6 items-center no-print'>
      {/* Mobile */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/" className='flex items-center gap-3'>
          <Image src="/logo2.png" width={100} height={100} alt="Logo" />
          {/* <div className="text-2xl tracking-wide">FAVINDO</div> */}
        </Link>
        <div className="flex items-center gap-6">
          <NavIcons />
          <Menu />
        </div>
      </div>
      <div className="search-bar md:hidden">
        <SearchBar />
      </div>
      {/* Big screen */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        {/* Left */}
        <div className="w-1/3 md:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={150} height={150} />
            {/* <div className="text-2xl tracking-wide">FAVINDO</div> */}
          </Link>
          <div className="hidden md:flex gap-4 items-center">
            <Link href="/">Home</Link>
            <Link href="/list">Shop</Link>
            {/* {!loggedIn ? (
              <Link href="/login">Login</Link>
            ) : (
              <button onClick={handleLogOut} className="bg-red-500 text-white px-4 py-2 rounded">
                Logout
              </button>
            )} */}
          </div>
        </div>
        {/* Right */}
        <div className="w-2/3 md:w-1/2 flex items-center justify-between gap-8">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
