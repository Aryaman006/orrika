// app/page.tsx (or app/page.jsx)

import React from 'react';
import Slider from '../components/Slider';
import ProductList from '../components/ProductList';
import CategoryList from '../components/CategoryList';
import LoadMoreButton from '../components/LoadMoreButton';
import Loading from '../components/Loading';
import { databases, Query } from '../context/appwrite';

export const revalidate = 60; // Revalidate every 60 seconds

const fetchData = async () => {
  try {
    const [categoriesResponse, slidesResponse, productsResponse] = await Promise.all([
      databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_ID),
      databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, process.env.NEXT_PUBLIC_APPWRITE_SLIDER_ID),
      databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID,
        [Query.limit(20)]
      ),
    ]);

    return {
      categories: categoriesResponse.documents,
      slides: slidesResponse.documents,
      products: productsResponse.documents,
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw new Error('Failed to fetch data');
  }
};

const HomePage = async () => {
  let data;

  try {
    data = await fetchData();
  } catch (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <Slider slides={data.slides} />
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="mt-24">
          <h1 className="text-2xl mb-12 text-center">Categories</h1>
          <CategoryList categories={data.categories} />
        </div>
        <div className="mt-24">
          <h1 className="text-2xl mb-12 text-center">Products</h1>
          <ProductList products={data.products} />
          <div className="flex justify-center mt-4">
            <LoadMoreButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
