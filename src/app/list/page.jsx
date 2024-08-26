'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Filters from '../../components/Filter';
import ProductList from '../../components/ProductList';
import Loading from '../../components/Loading';
import { databases } from '../../context/appwrite';

const fetchProducts = async () => {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID
    );
    return response.documents;
  } catch (error) {
    toast.error("Failed to fetch products:", error);
    throw new Error('Failed to fetch products');
  }
};

const fetchCategories = async () => {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_ID
    );
    return response.documents;
  } catch (error) {
    toast.error("Failed to fetch categories:", error);
    throw new Error('Failed to fetch categories');
  }
};

const fetchGenders = async () => {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_GENDER_ID
    );
    return response.documents;
  } catch (error) {
    toast.error("Failed to fetch genders:", error);
    throw new Error('Failed to fetch genders');
  }
};

const ShopClient = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [filterParams, setFilterParams] = useState({
    size: '',
    minPrice: '',
    maxPrice: '',
    category: '',
    gender: '',
    sort: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData, gendersData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchGenders(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setGenders(gendersData);

        // Create ID-to-name mappings
        const categoryMap = categoriesData.reduce((acc, category) => {
          acc[category.$id] = category.name;
          return acc;
        }, {});

        const genderMap = gendersData.reduce((acc, gender) => {
          acc[gender.$id] = gender.name;
          return acc;
        }, {});

        // Apply filters and search
        applyFiltersAndSearch(productsData, filterParams, categoryMap, genderMap, searchQuery);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]);

  useEffect(() => {
    // Create ID-to-name mappings
    const categoryMap = categories.reduce((acc, category) => {
      acc[category.$id] = category.category;
      return acc;
    }, {});

    const genderMap = genders.reduce((acc, gender) => {
      acc[gender.$id] = gender.name;
      return acc;
    }, {});

    applyFiltersAndSearch(products, filterParams, categoryMap, genderMap, searchQuery);
  }, [filterParams, products, categories, genders, searchQuery]);

  const applyFiltersAndSearch = (products, filterParams, categoryMap, genderMap, searchQuery) => {
    const { size, minPrice, maxPrice, category, gender, sort } = filterParams;
  
    let filtered = products;
    const idToNameCategoryMap = (id) => categoryMap[id] || '';
    const idToNameGenderMap = (id) => genderMap[id] || '';

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idToNameCategoryMap(product.category).toLowerCase().includes(searchQuery.toLowerCase()) ||
        idToNameGenderMap(product.gender).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    // Apply size filter
    if (size) {
      filtered = filtered.filter(product => product.size === size);
    }
    // Apply price filters
    if (minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
    }
    // Apply category filter
    if (category) {
      filtered = filtered.filter(product => categoryMap[product.category] === category);
    }
    // Apply gender filter
    if (gender) {
      filtered = filtered.filter(product => genderMap[product.gender] === gender);
    }
    // Apply sorting
    if (sort) {
      const [order, key] = sort.split(' ');
      filtered.sort((a, b) => {
        if (key === 'price') {
          return order === 'asc' ? a.price - b.price : b.price - a.price;
        } else if (key === 'lastUpdated') {
          return order === 'asc' ? new Date(b.$createdAt) - new Date(a.$createdAt) : new Date(a.$createdAt) - new Date(b.$createdAt);
        }
        return 0;
      });
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilterParams(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      <div className="hidden bg-pink-50 px-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            Grab up to 50% off on
            <br /> Selected Products
          </h1>
          <button className="rounded-3xl bg-lama text-white w-max py-3 px-5 text-sm">
            Buy Now
          </button>
        </div>
        <div className="relative w-1/3">
          <Image src="/woman.png" alt="Discount image" fill className="object-contain" />
        </div>
      </div>
      <Filters categories={categories} onFilterChange={handleFilterChange} />
      <ProductList products={filteredProducts} />
    </div>
  );
};

export default ShopClient;
