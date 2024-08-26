"use client";

import { useState, useEffect } from 'react';
import { account } from '../context/appwrite';
import PasswordModal from './PasswordModel';
import Loading from './Loading';
import { toast } from 'react-toastify';

const ProfilePage = ({ onBack }) => {
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const [updateData, setUpdateData] = useState({
    username: '',
    phone: '',
    email: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState(''); // State for password input

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDetails = await account.get(); // Get logged-in user details
        setUser(userDetails);
        setUpdateData({
          username: userDetails.name || "john",
          phone: userDetails.phone || "+1234567",
          email: userDetails.email || "john@gmail.com"
        });
        if(userDetails){
          setLoading(false);
        }
      } catch (error) {
        toast.error('Failed to fetch user details:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    
    try {
      if (!validateEmail(updateData.email)) {
        alert('Invalid email address');
        return;
      }


      await account.updateEmail(user.$id, updateData.email, password);
      await account.updatePrefs(user.$id, {
        name: updateData.username,
        phone: updateData.phone
      });

      setShowPasswordModal(false);
      alert('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  const validateEmail = (email) => {
    // Simple email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prevData => ({ ...prevData, [name]: value }));
  };

  if(loading){
    return <Loading/>
  }
  

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 transition-colors"
      >
        Back to Dashboard
      </button>
      <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-semibold mb-6">Profile</h1>
        <div className="flex flex-col gap-6">
          <div className="text-sm text-gray-700 space-y-4">
            <p><strong>Username:</strong> {user.name || "john"}</p>
            <p><strong>Phone:</strong> {user.phone || "+1234567"}</p>
            <p><strong>Email:</strong> {user.email || "john@gmail.com"}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <label className="text-sm text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={updateData.username}
                onChange={handleChange}
                className="ring-1 ring-gray-300 rounded-md p-2"
              />
              <label className="text-sm text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={updateData.phone}
                onChange={handleChange}
                className="ring-1 ring-gray-300 rounded-md p-2"
              />
              <label className="text-sm text-gray-700">E-mail</label>
              <input
                type="email"
                name="email"
                value={updateData.email}
                onChange={handleChange}
                className="ring-1 ring-gray-300 rounded-md p-2"
              />
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handleUpdate}
      >
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Confirm Update</h2>
          <p className="mb-4">Please enter your password to confirm the update:</p>
          <input
            type="password"
            placeholder="Password"
            className="ring-1 ring-gray-300 rounded-md p-2 w-full"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </PasswordModal>
    </div>
  );
};

export default ProfilePage;
