"use client";
import React, { useEffect, useState } from 'react';
import ProductImages from '../../../components/ProductImages';
import CustomisedProducts from '../../../components/CustomisedProducts';
import Add from '../../../components/Add';
import { databases } from '../../../context/appwrite';
import RelatedProducts from '../../../components/RelatedProducts';
import Loading from '../../../components/Loading';

const SlugPage = () => {
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const url = window.location.pathname;
        const id = url.substring(url.lastIndexOf('/') + 1);
        const response = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID,
          id
        );
        if (response.variants && response.variants.length > 0) {
          const variants = response.variants.map(variant => JSON.parse(variant));
          response.variants = variants;
        } else {
          response.variants = [];
        }
  
        // Parse the variants JSON string
        // if (response.variants && response.variants.length > 0) {
          // const variants = JSON.parse(response.variants);
          // response.variants = variants;
        // } else {
          // response.variants = [];
        // }

        setProduct(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);


  const handleVariantSelection = (variant) => {
    setSelectedVariant(variant);
  };

  if (loading) return (<Loading/>);
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col gap-16">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Img */}
        <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
          <ProductImages post={product.post} />
        </div>
        {/* text */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl font-medium">{product.name}</h1>
          <p className="text-gray-500">{product.description}</p>
          <div className="h-[2px] bg-gray-100"></div>
          <div className="flex items-center gap-4">
            <h1 className="text-xl text-gray-500 line-through">${product.mrp}</h1>
            <h1 className="font-medium text-2xl">${product.price}</h1>
          </div>
          <div className="h-[2px] bg-gray-100"></div>
          <CustomisedProducts variants={product.variants} onVariantSelect={handleVariantSelection} />
          <Add productId={product.$id} name={product.name} selectedVariant={selectedVariant} imageUrl={product.post[0]}/>
          <div className="h-[2px] bg-gray-100"></div>
        </div>
      </div>
      {/* Related Products */}
      <RelatedProducts 
        category={product.category} 
        currentProductId={product.$id} 
        description={product.description}
        name={product.name}
      />
    </div>
  );
};

export default SlugPage;
