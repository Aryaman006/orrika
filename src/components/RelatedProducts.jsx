// components/RelatedProducts.js
import React, { useEffect, useState } from 'react';
import { databases, Query } from '../context/appwrite';
import ProductList from './ProductList';
import { toast } from 'react-toastify';

const RelatedProducts = ({ category, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Fetch related products from the same category
        const relatedResponse = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID,
          [
            Query.equal('category', category),
            Query.notEqual('$id', currentProductId), // Exclude the current product
            Query.limit(5) // Limit to 5 related products for example
          ]
        );

        setRelatedProducts(relatedResponse.documents);
      } catch (error) {
        toast.error('Error fetching related products:', error);
      }
    };

    if (category) {
      fetchRelatedProducts();
    }
  }, [category, currentProductId]);

  return (
    <div className="related-products mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Related Products</h2>
      <ProductList products={relatedProducts} />
    </div>
  );
};

export default RelatedProducts;
