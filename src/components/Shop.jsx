import React from 'react';

const ShopPage = ({ products, heading }) => {
  return (
    <div className="w-3/4 p-5">
      <h2 className="text-2xl font-bold mb-6">{heading}</h2>
      <div className="flex flex-wrap -mx-2">
        {products.map(product => (
          <div key={product.id} className="w-1/3 p-2">
            <div className="border rounded-lg p-4 text-center">
              <img src={product.image} alt={product.name} className="w-full h-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-700">{product.color}</p>
              <p className="text-gray-700">{product.size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
