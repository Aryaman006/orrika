// src/context/ProductContext.js
"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import { databases, Query } from './appwrite';

 const ProductContext = createContext();


 const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchProducts = async (page = 0) => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID,
        [Query.limit(10), Query.offset(page * 10)]
      );
      setProducts((prev) => [...prev, ...response.documents]);
      setHasMoreProducts(response.documents.length === 10);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, slidesResponse] = await Promise.all([
          databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_ID),
          databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, process.env.NEXT_PUBLIC_APPWRITE_SLIDER_ID),
        ]);

        setCategories(categoriesResponse.documents);
        setSlides(slidesResponse.documents);
        await fetchProducts();
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadMoreProducts = () => {
    if (hasMoreProducts) {
      fetchProducts(currentPage + 1);
    }
  };

  const contextValue = {
    categories,
    products,
    slides,
    loadMoreProducts,
    loading,
    error,
    hasMoreProducts
  }

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

const useProducts = () => useContext(ProductContext);

export {ProductProvider,useProducts}
