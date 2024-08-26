import React, { useState } from 'react';


const CustomisedProducts = ({ variants = [], onVariantSelect }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);


  const handleColorClick = (variant) => {
    setSelectedColor(variant.color);
    setAvailableSizes(variant.sizes);
    setSelectedSize(null); // Reset selected size when a new color is selected
    onVariantSelect(null); // Reset selected variant in parent component
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size.size);
    const selectedVariant = {
      color: selectedColor,
      size: size.size,
      price: size.price,
      stock:size.stock
    };
    onVariantSelect(selectedVariant); // Pass the selected variant to the parent
  };

  return (
    <div className="flex flex-col gap-6">
      <h4 className="font-medium">Choose a color</h4>
      <ul className="flex items-center gap-3 relative">
        {variants?.map((variant, index) => (
          <li
            key={index}
            className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative"
            style={{ backgroundColor: variant.color }}
            onClick={() => handleColorClick(variant)}
          >
            {selectedColor === variant.color && (
              <div className="absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            )}
          </li>
        ))}
      </ul>
      <h4 className="font-medium">Choose a size</h4>
      <ul className="flex items-center gap-3">
        {availableSizes.map((size, index) => (
          <li
            key={index}
            className={`ring-1 text-sm rounded-md py-1 px-4 cursor-pointer ${
              size.stock ? 'ring-[#F35C7A] text-[#F35C7A] bg-white' : 'ring-gray-300 text-gray-300 cursor-not-allowed'
            } ${
              selectedSize === size.size ? 'ring-2 ring-[#F35C7A] text-white bg-[#F35C7A]' : ''
            }`}
            onClick={() => size.stock && handleSizeClick(size)}
          >
            {size.size}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomisedProducts;