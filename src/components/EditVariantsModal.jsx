"use client";

import React, { useState } from 'react';

const EditVariantsModal = ({ variants, onClose, onSave }) => {
  const [localVariants, setLocalVariants] = useState(variants);

  const handleColorChange = (index, color) => {
    const updatedVariants = [...localVariants];
    updatedVariants[index] = { ...updatedVariants[index], color };
    setLocalVariants(updatedVariants);
  };

  const handleSizeChange = (variantIndex, sizeIndex, sizeField, value) => {
    const updatedVariants = [...localVariants];
    updatedVariants[variantIndex].sizes[sizeIndex][sizeField] = value;
    setLocalVariants(updatedVariants);
  };

  const handleAddSize = (index) => {
    const updatedVariants = [...localVariants];
    updatedVariants[index].sizes.push({ size: '', price: '', stock: '' });
    setLocalVariants(updatedVariants);
  };

  const handleRemoveSize = (variantIndex, sizeIndex) => {
    const updatedVariants = [...localVariants];
    updatedVariants[variantIndex].sizes = updatedVariants[variantIndex].sizes.filter((_, i) => i !== sizeIndex);
    setLocalVariants(updatedVariants);
  };

  const handleAddVariant = () => {
    setLocalVariants([...localVariants, { color: '', sizes: [{ size: '', price: '', stock: '' }] }]);
  };

  const handleRemoveVariant = (index) => {
    setLocalVariants(localVariants.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(localVariants);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-full overflow-auto">
        <h3 className="text-xl font-bold mb-4">Edit Variants</h3>
        
        {localVariants.map((variant, variantIndex) => (
          <div key={variantIndex} className="mb-4 border p-4 rounded">
            <h4 className="font-medium mb-2">Color</h4>
            <input
              type="text"
              value={variant.color}
              onChange={(e) => handleColorChange(variantIndex, e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            
            <h4 className="font-medium mt-4 mb-2">Sizes</h4>
            {variant.sizes.map((size, sizeIndex) => (
              <div key={sizeIndex} className="mb-2 border p-2 rounded">
                <input
                  type="text"
                  placeholder="Size"
                  value={size.size}
                  onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'size', e.target.value)}
                  className="w-full px-3 py-2 border rounded mb-2"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={size.price}
                  onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'price', e.target.value)}
                  className="w-full px-3 py-2 border rounded mb-2"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={size.stock}
                  onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'stock', e.target.value)}
                  className="w-full px-3 py-2 border rounded mb-2"
                />
                <button
                  onClick={() => handleRemoveSize(variantIndex, sizeIndex)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Remove Size
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddSize(variantIndex)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Size
            </button>
            <button
              onClick={() => handleRemoveVariant(variantIndex)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2"
            >
              Remove Variant
            </button>
          </div>
        ))}
        <button
          onClick={handleAddVariant}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Variant
        </button>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVariantsModal;
