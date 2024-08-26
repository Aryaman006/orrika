"use client";

import { useState, useEffect } from 'react';
import { Client, Databases, Account } from 'appwrite';

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) // Your Appwrite endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID); // Your Appwrite project ID

const databases = new Databases(client);
const account = new Account(client);

// Fetch product by ID
const fetchProductById = async (documentId) => {
  try {
    const response = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, // Your database ID
      process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID, // Your collection ID
      documentId // The document ID
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
};

// Fetch user session
const getUserSession = async () => {
  try {
    const user = await account.get();
    console.log('Authenticated user:', user);
    return user;
  } catch (error) {
    console.error('No active session found:', error);
    return null;
  }
};

// Delete product by ID
const deleteProductById = async (documentId) => {
  try {
    // Check if the document exists before attempting to delete
    const product = await fetchProductById(documentId);
    if (!product) {
      console.error('Document not found.');
      return;
    }

    // Perform deletion
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, // Your database ID
      process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID, // Your collection ID
      documentId // The document ID
    );
    console.log(`Deleted product: ${documentId}`);
  } catch (error) {
    console.error('Failed to delete document:', error);
    if (error.message.includes('Unauthorized')) {
      console.error('Check if the API key or user session has the necessary permissions.');
    } else if (error.message.includes('Not Found')) {
      console.error('Check if the document ID, collection ID, and database ID are correct.');
    }
  }
};

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const documentId = 'b2cf61db-b4b6-4a2f-a86e-9a1389c7951f'; // Replace with actual document ID or retrieve dynamically

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const fetchedProduct = await fetchProductById(documentId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setError(''); // Clear any previous errors
      } else {
        setError('Failed to fetch product details.');
        setProduct(null); // Ensure product is set to null in case of failure
      }
      setLoading(false);
    };

    const loadUserSession = async () => {
      const fetchedUser = await getUserSession();
      setUser(fetchedUser);
    };

    loadProduct();
    loadUserSession();
  }, [documentId]);

  const handleDeleteProduct = async () => {
    if (!user) {
      setError('User is not authenticated.');
      return;
    }

    await deleteProductById(documentId);
    // Redirect or update UI after deletion
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found.</div>;
  }

  return (
    <div>
      <h1>Product Details</h1>
      <p><strong>Name:</strong> {product.name}</p>
      <p><strong>Price:</strong> {product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
      {/* Render other product details as needed */}
      {user && (
        <button onClick={handleDeleteProduct} className="text-red-500 hover:underline">
          Delete Product
        </button>
      )}
    </div>
  );
};

export default ProductDetail;
