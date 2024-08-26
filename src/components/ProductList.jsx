import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ProductList = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-2">
      {products.map((product) => (
        <Link key={product.$id} href={`/list/${product.$id}`} className="flex flex-col gap-4">
          <div className="relative w-full h-80">
            {product.post?.[0] ? (
              <>
                <Image
                  src={product.post[0]}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="absolute rounded-md z-10 hover:opacity-0 transition-opacity ease-in-out duration-500"
                />
                <Image
                  src={product.post[1] || product.post[0]}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="absolute rounded-md z-0"
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
                <span>No Image Available</span>
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{product.name}</span>
            <span className="font-semibold">${product.price}</span>
          </div>
          <div className="text-sm text-gray-500">{product.description}</div>
          <button className="text-xs rounded-2xl ring-1 w-max ring-[#F35C7A] text-[#F35C7A] py-2 px-4 hover:bg-[#F35C7A] hover:text-white">
            Add To Cart
          </button>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
