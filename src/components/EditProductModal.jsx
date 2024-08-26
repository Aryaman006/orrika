"use client";

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import EditVariantsModal from './EditVariantsModal';
import { account, databases, storage } from '../context/appwrite';
import { toast } from 'react-toastify'; // Import toast

const EditProductModal = ({ product, onClose, onUpdate, onRemove }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [mrp, setMrp] = useState(product.mrp);
  const [category, setCategory] = useState(product.category);
  const [images, setImages] = useState(product.post || []);
  const [imageFiles, setImageFiles] = useState([]);
  const [variants, setVariants] = useState(product.variants.map(v => JSON.parse(v)) || []);
  const [isVariantsModalOpen, setIsVariantsModalOpen] = useState(false);
  const [gender, setGender] = useState(product.gender || '');
  const [genders, setGenders] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch available genders
    const fetchGenders = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_GENDER_ID
        );
        setGenders(response.documents);
      } catch (error) {
        toast.error('Failed to fetch genders:', error);
      }
    };

    // Fetch available categories
    const fetchCategories = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_ID // Update with your categories collection ID
        );
        setCategories(response.documents);
      } catch (error) {
        toast.error('Failed to fetch categories:', error);
      }
    };

    fetchGenders();
    fetchCategories();
  }, []);

  const handleAddImageField = () => {
    setImageFiles([...imageFiles, null]);
  };

  const handleRemoveImageField = (index) => {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
  };

  const handleFileChange = (e, index) => {
    const newImageFiles = [...imageFiles];
    newImageFiles[index] = e.target.files[0];
    setImageFiles(newImageFiles);
  };

  const handleImageRemove = (image) => {
    setImages(images.filter((img) => img !== image));
  };

  const handleOpenVariantsModal = () => {
    setIsVariantsModalOpen(true);
  };

  const handleCloseVariantsModal = () => {
    setIsVariantsModalOpen(false);
  };

  const handleSaveVariants = (updatedVariants) => {
    setVariants(updatedVariants);
    setIsVariantsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      // Upload images and prepare updated product object
      const uploadedImageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          if (!file) return null;

          const fileId = uuidv4();
          const response = await storage.createFile(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
            fileId,
            file
          );

          const fileUrl = storage.getFileView(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
            response.$id
          ).href;

          return fileUrl;
        })
      );

      const validImageUrls = uploadedImageUrls.filter(url => url !== null);
      const serializedVariants = variants.map(variant => JSON.stringify(variant));

      const updatedProduct = {
        name,
        price: parseInt(price),
        description,
        mrp: parseInt(mrp),
        category,
        gender,
        post: [...images, ...validImageUrls],
        variants: serializedVariants,
      };


      const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID,
        product.$id,
        updatedProduct
      );

      onUpdate(updatedProduct);
      onClose();
    } catch (error) {
      toast.error('Failed to update product:', error);
    }
  };

  const handleRemoveProduct = async () => {
    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID,
        product.$id
      );

      onRemove(product.$id);
      onClose();
    } catch (error) {
      toast.error('Failed to remove product:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3 max-h-full overflow-hidden">
        <h3 className="text-xl font-bold mb-4">Edit Product</h3>
        <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {/* Name */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {/* Price */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {/* Description */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {/* MRP */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">MRP</label>
            <input
              type="number"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {/* Category */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.$id} value={cat.$id}>{cat.category}</option>
              ))}
            </select>
          </div>
          {/* Gender */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Gender</option>
              {genders.map(g => (
                <option key={g.$id} value={g.$id}>{g.name}</option>
              ))}
            </select>
          </div>
          {/* Images */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Images</label>
            {images.map((image, index) => (
              <div key={index} className="flex items-center mb-2">
                <img src={image} alt="Product" className="w-16 h-16 object-cover mr-2" />
                <button
                  onClick={() => handleImageRemove(image)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            {imageFiles.map((_, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, index)}
                  className="mr-2"
                />
                <button
                  onClick={() => handleRemoveImageField(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddImageField}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Image
            </button>
          </div>
          {/* Variants */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Variants</label>
            <button
              onClick={handleOpenVariantsModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
              Edit Variants
            </button>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Save
          </button>
          <button
            onClick={handleRemoveProduct}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
          >
            Remove Product
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
      {isVariantsModalOpen && (
        <EditVariantsModal
          variants={variants}
          onClose={handleCloseVariantsModal}
          onSave={handleSaveVariants}
        />
      )}
    </div>
  );
};

export default EditProductModal;
