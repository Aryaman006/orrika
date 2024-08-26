"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const SearchBar = () => {
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("searchQuery");

    // Navigate to the shop page with the search query as a filter
    if (searchQuery) {
      router.push(`list?search=${searchQuery}`);
      e.currentTarget.reset();
    }
  };

  return (
    <form
    className="flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1 border-black"
    onSubmit={handleSearch}
  >
    <input
      type="text"
      name="searchQuery"
      placeholder="Search"
      className="flex-1 bg-transparent outline-none"
    />
    <button type="submit" className="cursor-pointer">
      <Image src="/search.png" alt="Search" width={16} height={16} />
    </button>
  </form>
  );
};

export default SearchBar;