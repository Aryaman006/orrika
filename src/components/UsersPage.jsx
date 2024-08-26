import { useEffect, useState } from 'react';
import { databases } from '../context/appwrite';
import { toast } from 'react-toastify';

const UsersPage = ({onBack}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_ADDRESSES_ID // Assuming this collection stores user information
        );
        setUsers(response.documents);
      } catch (error) {
        toast.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
         <button onClick={onBack} className="text-blue-500 mb-4 hover:underline">← Back</button>
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.$id} className="p-4 bg-gray-100 rounded-lg">
            <p className="font-medium">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
