'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LoadMoreButton() {
  const router = useRouter();

  return (
    <button
      className="px-4 py-2 bg-black text-white rounded"
      onClick={() => router.push('/shop')}
    >
      Load More
    </button>
  );
}
