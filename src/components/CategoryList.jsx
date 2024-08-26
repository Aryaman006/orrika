"use client";
import React from 'react';
import Link from "next/link";
import Image from 'next/image';
import { toast } from 'react-toastify'; // Import toast

const CategoryList = ({ categories }) => {
  if (!categories?.length) {
    toast.error("No categories available");
  }

  return (
    <div className="px-4 overflow-x-scroll" style={{ scrollbarWidth: "none" }}>
      <div className="flex gap-4 md:gap-8 justify-around">
        {categories?.length > 0 ? (
          categories.map((cat) => (
            <Link
              key={cat.$id}
              href={`/list?cat=${cat.category}`}
              className="flex-shrink-0 w-full sm:w-2/3 lg:w-1/2 xl:w-1/3"
            >
              <div className="relative bg-slate-100 w-full h-96">
                <Image
                  src={cat.image}
                  alt={`${cat.category} image`}
                  layout="intrinsic"
                  sizes="20vw"
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  <span className="font-medium">{cat.category}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-gray-500">No categories available</div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
