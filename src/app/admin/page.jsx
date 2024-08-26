"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaBox, FaTags } from 'react-icons/fa';
import UsersPage from '../../components/UsersPage';
import OrdersPage from '../../components/OrdersPage';
import ProductsPage from '../../components/ProductsPage';
import Footer from '../../components/Footer'; // Import your footer component
import ProductsList from '../../components/ProductsList';
import { FaCableCar, FaSliders } from 'react-icons/fa6';
import SliderManager from '../../components/Sliders';
import CategoryManager from '../../components/CategoryManager';
import GenderManager from '../../components/GenderManager';
import { account } from '../../context/appwrite'; // Adjust import path as needed
import { toast } from 'react-toastify';

const AdminPanelLayout = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = await account.get();
        setIsAdmin(user.labels.includes('admin')); // Adjust according to your user object structure

        if (!user || !user.labels.includes('admin')) {
          router.push('/profile'); // Redirect to profile page if not an admin
        }
      } catch (error) {
        toast.error("Error fetching user:", error);
        router.push('/profile'); // Redirect to profile page if error occurs
      } finally {
        setIsLoading(false); // Set loading to false when check is complete
      }
    };

    checkAdminStatus();
  }, [router]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleBackClick = () => {
    setActiveTab(null);
  };

  const handleSignOut = async () => {
    try {
      // Add your sign-out logic here
      router.push('/'); 
      window.location.reload();
    } catch (error) {
      toast.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Optional: Add a loading spinner or message
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow flex-col md:flex-row">
        <div className={`w-full md:w-1/4 bg-gray-100 shadow-lg ${activeTab ? 'hidden md:block' : 'block'}`}>
          <div className="p-4 h-full">
            <h1 className="text-2xl font-semibold mb-6 text-gray-700">Admin Panel</h1>
            <ul>
              <li className="mb-2">
                <button
                  onClick={() => handleTabClick('users')}
                  aria-current={activeTab === 'users' ? 'true' : 'false'}
                  className={`w-full text-left py-2 px-4 rounded-lg flex items-center transition-colors duration-300 ${activeTab === 'users' ? 'bg-gray-300' : 'hover:bg-gray-200'} text-gray-800`}
                >
                  <FaUser className="mr-2 text-gray-600" /> Manage Users
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => handleTabClick('orders')}
                  aria-current={activeTab === 'orders' ? 'true' : 'false'}
                  className={`w-full text-left py-2 px-4 rounded-lg flex items-center transition-colors duration-300 ${activeTab === 'orders' ? 'bg-gray-300' : 'hover:bg-gray-200'} text-gray-800`}
                >
                  <FaBox className="mr-2 text-gray-600" /> Manage Orders
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => handleTabClick('product')}
                  aria-current={activeTab === 'product' ? 'true' : 'false'}
                  className={`w-full text-left py-2 px-4 rounded-lg flex items-center transition-colors duration-300 ${activeTab === 'orders' ? 'bg-gray-300' : 'hover:bg-gray-200'} text-gray-800`}
                >
                  <FaBox className="mr-2 text-gray-600" /> Manage Product
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => handleTabClick('products')}
                  aria-current={activeTab === 'products' ? 'true' : 'false'}
                  className={`w-full text-left py-2 px-4 rounded-lg flex items-center transition-colors duration-300 ${activeTab === 'products' ? 'bg-gray-300' : 'hover:bg-gray-200'} text-gray-800`}
                >
                  <FaTags className="mr-2 text-gray-600" /> Manage Products
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => handleTabClick('sliders')}
                  aria-current={activeTab === 'sliders' ? 'true' : 'false'}
                  className={`w-full text-left py-2 px-4 rounded-lg flex items-center transition-colors duration-300 ${activeTab === 'sliders' ? 'bg-gray-300' : 'hover:bg-gray-200'} text-gray-800`}
                >
                  <FaSliders className="mr-2 text-gray-600" /> Manage Sliders
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => handleTabClick('category')}
                  aria-current={activeTab === 'gender' ? 'true' : 'false'}
                  className={`w-full text-left py-2 px-4 rounded-lg flex items-center transition-colors duration-300 ${activeTab === 'gender' ? 'bg-gray-300' : 'hover:bg-gray-200'} text-gray-800`}
                >
                  <FaCableCar className="mr-2 text-gray-600" /> Manage Categories
                </button>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left py-2 px-4 rounded-lg text-red-600 hover:bg-red-100"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-3/4 p-4 flex-grow">
          <div className="flex flex-col min-h-screen">
            {activeTab === 'users' && <UsersPage onBack={handleBackClick} />}
            {activeTab === 'orders' && <OrdersPage onBack={handleBackClick} />}
            {activeTab === 'products' && <ProductsPage onBack={handleBackClick} />}
            {activeTab === 'product' && <ProductsList onBack={handleBackClick} />}
            {activeTab === 'sliders' && <SliderManager onBack={handleBackClick} />}
            {activeTab === 'category' && <CategoryManager onBack={handleBackClick} />}
            {activeTab === 'gender' && <GenderManager onBack={handleBackClick} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelLayout;
