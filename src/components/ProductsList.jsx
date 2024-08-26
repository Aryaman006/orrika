"use client";

import { useState, useEffect } from 'react';
import { Client, Databases, Storage } from 'appwrite';
import EditProductModal from './EditProductModal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const getFileIdFromUrl = (url) => {
  const parts = url.split('/');
  return parts[parts.length - 2]; // Adjust if your URL structure is different
};

const ProductsList = ({ onBack }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const client = new Client();
  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const databases = new Databases(client);
  const storage = new Storage(client);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID
        );
        setProducts(response.documents);
      } catch (error) {
        toast.error('Failed to fetch products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_ID
        );
        const categoryMap = response.documents.reduce((acc, category) => {
          acc[category.$id] = category.category;
          return acc;
        }, {});
        setCategories(categoryMap);
      } catch (error) {
        toast.error('Failed to fetch categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleRemoveProduct = async (productId, imageUrls = []) => {
    try {
      // Validate imageUrls is an array
      if (!Array.isArray(imageUrls)) {
        toast.error('Invalid imageUrls:', imageUrls);
        return;
      }

      // Delete associated images
      await Promise.all(
        imageUrls.map(async (imageUrl) => {
          const fileId = getFileIdFromUrl(imageUrl);
          try {
            await storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, fileId);
          } catch (err) {
            toast.error(`Failed to delete file ${fileId}:`, err);
          }
        })
      );

      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID,
        productId
      );
    } catch (err) {
      toast.error('Failed to handle removal:', err);
      if (err.message.includes('Unauthorized')) {
        toast.error('Check if the API key or user session has the necessary permissions.');
      } else if (err.message.includes('Not Found')) {
        toast.error('Check if the document ID, collection ID, and database ID are correct.');
      }
    }
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map((product) =>
      product.$id === updatedProduct.$id ? updatedProduct : product
    ));
    setShowEditModal(false);
  };


  return (
    <div className="p-4">
      <button
        onClick={onBack}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

      {showEditModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateProduct}
        />
      )}

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.$id}>
              <td className="border border-gray-300 px-4 py-2">{product.name}</td>
              <td className="border border-gray-300 px-4 py-2">{product.price}</td>
              <td className="border border-gray-300 px-4 py-2">
                {categories[product.category] || 'Unknown'}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleRemoveProduct(product.$id, product.images)}
                  className="text-red-500 hover:underline"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsList;
