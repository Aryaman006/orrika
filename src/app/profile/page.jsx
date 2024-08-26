"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '../../context/appwrite'; // Ensure this import points to your Appwrite configuration
import ProfilePage from '../../components/Profile';
import { FaUser, FaBox, FaMapMarkerAlt } from 'react-icons/fa';
import AddressPage from '../../components/Address';
import Orders from '../../components/Orders';
import { toast } from 'react-toastify';

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState(null);
  const router = useRouter();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleBackClick = () => {
    setActiveTab(null);
  };

  const handleSignOut = async () => {
    try {
      await account.deleteSession('current');
      router.push('/'); 
      window.location.reload();
    } catch (error) {
      toast.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className={`md:w-1/4 w-full md:block ${activeTab ? 'hidden' : 'block'} bg-gray-100 shadow-lg`}>
        <div className="p-4 h-full">
          <h1 className="text-2xl font-semibold mb-6 text-gray-700">Account</h1>
          <ul>
            <li className="mb-2">
              <button
                onClick={() => handleTabClick('profile')}
                aria-current={activeTab === 'profile' ? 'true' : 'false'}
                className={`w-full text-left py-2 px-4 rounded-lg flex items-center transition-colors duration-300 ${activeTab === 'profile' ? 'bg-gray-300' : 'hover:bg-gray-200'} text-gray-800`}
              >
                <FaUser className="mr-2 text-gray-600" /> My Profile
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => handleTabClick('orders')}
                aria-current={activeTab === 'orders' ? 'true' : 'false'}
                className={`w-full text-left py-2 px-4 rounded-lg flex items-center transition-colors duration-300 ${activeTab === 'orders' ? 'bg-gray-300' : 'hover:bg-gray-200'} text-gray-800`}
              >
                <FaBox className="mr-2 text-gray-600" /> My Orders
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => handleTabClick('addresses')}
                aria-current={activeTab === 'addresses' ? 'true' : 'false'}
                className={`w-full text-left py-2 px-4 rounded-lg flex items-center transition-colors duration-300 ${activeTab === 'addresses' ? 'bg-gray-300' : 'hover:bg-gray-200'} text-gray-800`}
              >
                <FaMapMarkerAlt className="mr-2 text-gray-600" /> My Addresses
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
      <div className="md:w-3/4 w-full p-4">
        {activeTab === 'profile' && <ProfilePage onBack={handleBackClick} />}
        {activeTab === 'orders' && <Orders onBack={handleBackClick} />}
        {activeTab === 'addresses' && <AddressPage />}
      </div>
    </div>
  );
};

export default DashboardLayout;
