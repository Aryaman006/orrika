"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases, Query } from '../context/appwrite';
import Loading from './Loading';
import AddressModal from './AddressModal';
import { IoMdArrowRoundBack } from "react-icons/io";
import {toast} from 'react-toastify'

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const router = useRouter(); // Access the router for navigation

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const user = await account.get(); // Get logged-in user details

        const addressList = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_ADDRESSES_ID,
          [Query.equal('userId', user.$id)]
        );

        setAddresses(addressList.documents);
      } catch (error) {
        toast.error(error)
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleSaveAddress = async (address) => {
    try {
      const user = await account.get();
      if (addressToEdit) {
        // Update existing address
        await databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_ADDRESSES_ID,
          addressToEdit.$id,
          { ...address, userId: user.$id } // Ensure userId is updated
        );

        setAddresses(addresses.map(addr =>
          addr.$id === addressToEdit.$id ? { ...addr, ...address } : addr
        ));
      } else {
        // Add new address
        const newAddress = await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_ADDRESSES_ID,
          'unique()', // Generate a unique ID
          {
            userId: user.$id,
            ...address,
          }
        );

        setAddresses([...addresses, newAddress]);
      }
    } catch (error) {
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_ADDRESSES_ID,
        id
      );

      setAddresses(addresses.filter(address => address.$id !== id));
    } catch (error) {
      toast.error(error)
    }
  };

  const openModal = (address = null) => {
    setAddressToEdit(address);
    setShowModal(true);
  };

  const closeModal = () => {
    setAddressToEdit(null);
    setShowModal(false);
  };

  const handleBack = () => {
    router.back(); // Go back to the previous page
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loading/></div>;
  }

  return (
    <div className="flex flex-col items-center px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
      <div className="w-full max-w-3xl mb-8 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-700 text-white rounded-md shadow-md hover:bg-gray-800 transition-colors block md:hidden"
        >
          <IoMdArrowRoundBack />
        </button>
        <h1 className="text-4xl font-bold text-center text-gray-800">My addresses</h1>
      </div>
      
      <div className="w-full max-w-3xl mb-8 flex justify-end">
        <div
          className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white text-2xl rounded-full cursor-pointer"
          onClick={() => openModal()}
        >
          +
        </div>
      </div>
      
      {addresses.length === 0 ? (
        <div className="text-center text-gray-500">You have no addresses yet.</div>
      ) : (
        <div className="flex flex-col gap-6 w-full max-w-3xl">
          {addresses.map((address) => (
            <div key={address.$id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-800">{address.address}</div>
                  <div className="text-sm text-gray-600">{address.phone}</div>
                </div>
                <div className="text-sm text-gray-600">{address.email}</div>
                <div className="text-sm text-gray-600">{address.city}, {address.state} {address.pinCode}</div>
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => openModal(address)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.$id)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Component */}
      <AddressModal
        isOpen={showModal}
        onClose={closeModal}
        addressToEdit={addressToEdit}
        onSave={handleSaveAddress}
      />
    </div>
  );
};

export default AddressPage;
