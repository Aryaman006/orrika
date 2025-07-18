import { useState, useEffect } from 'react';
import { Client, Databases, Storage } from 'appwrite';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const ProductsPage = ({onBack}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [mrp, setMrp] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [gender, setGender] = useState('');
  const [genders, setGenders] = useState([]);
  const [images, setImages] = useState(['']);
  const [variants, setVariants] = useState([
    { id: 1, color: '', sizes: [{ size: '', price: '', stock: '' }] },
  ]);

  const client = new Client();
  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const databases = new Databases(client);
  const storage = new Storage(client);

  useEffect(() => {
    const fetchCategoriesAndGenders = async () => {
      try {
        const [categoriesResponse, gendersResponse] = await Promise.all([
          databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_ID
          ),
          databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            process.env.NEXT_PUBLIC_APPWRITE_GENDER_ID
          )
        ]);
        setCategories(categoriesResponse.documents);
        setGenders(gendersResponse.documents);
      } catch (error) {
        console.error('Failed to fetch categories or genders:', error);
      }
    };
    fetchCategoriesAndGenders();
  }, []);

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);
  };

  const handleAddImageField = () => {
    setImages([...images, '']);
  };

  const handleRemoveImageField = (index) => {
    const updatedImages = images.filter((_, imgIndex) => imgIndex !== index);
    setImages(updatedImages);
  };

  const handleAddVariant = () => {
    const nextId = variants.length ? Math.max(...variants.map(v => v.id)) + 1 : 1;
    setVariants([...variants, { id: nextId, color: '', sizes: [{ size: '', price: '', stock: '' }] }]);
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = variants.filter((_, variantIndex) => variantIndex !== index);
    setVariants(updatedVariants);
  };

  const handleVariantChange = (e, variantIndex, key) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex][key] = e.target.value;
    setVariants(updatedVariants);
  };

  const handleSizeChange = (e, variantIndex, sizeIndex, key) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].sizes[sizeIndex][key] = e.target.value;
    setVariants(updatedVariants);
  };

  const handleAddSize = (variantIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].sizes.push({ size: '', price: '', stock: '' });
    setVariants(updatedVariants);
  };

  const handleRemoveSize = (variantIndex, sizeIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].sizes = updatedVariants[variantIndex].sizes.filter((_, idx) => idx !== sizeIndex);
    setVariants(updatedVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Validate fields
      if (!name || !price || !description || !mrp || !category || !gender) {
        throw new Error('Please fill in all required fields.');
      }
  
      // Upload images
      const uploadedImageUrls = await Promise.all(
        images.map(async (file) => {
          if (!file) return null;
          const fileId = uuidv4();
          const response = await storage.createFile(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
            fileId,
            file
          );
          return storage.getFileView(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
            response.$id
          ).href;
        })
      );
  
      const validImageUrls = uploadedImageUrls.filter((url) => url !== null);
      const serializedVariants = variants.map(variant => JSON.stringify(variant));
  
      const productData = {
        name,
        price: parseInt(price),
        description,
        mrp: parseInt(mrp),
        category, 
        gender, // Include gender in the product data
        post: validImageUrls,
        variants: serializedVariants,
      };
  console.log(productData);
  
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID,
        uuidv4(),
        productData
      );
  
      alert('Product created successfully!');
      setName('');
      setPrice('');
      setDescription('');
      setMrp('');
      setCategory('');
      setGender('');
      setImages(['']);
      setVariants([{ id: 1, color: '', sizes: [{ size: '', price: '', stock: '' }] }]);
    } catch (error) {
      toast.error('Failed to create product:', error);
      console.log(error);
      
      // alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <button onClick={onBack} className="text-blue-500 mb-4 hover:underline">← Back</button>
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} style={{ overflowY: "scroll", scrollbarWidth: "none" }}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">MRP</label>
            <input
              type="number"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.$id} value={cat.$id}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select a gender</option>
              {genders.map((gen) => (
                <option key={gen.$id} value={gen.$id}>
                  {gen.name}
                </option>
              ))}
            </select>
          </div>
          {/* ...Rest of the form remains the same... */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Images</h3>
            {images.map((image, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, index)}
                  className="w-full px-3 py-2 border rounded"
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImageField(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImageField}
              className="mt-2 text-blue-500 hover:text-blue-700"
            >
              Add More Images
            </button>
          </div>
            <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Variants</h3>
            {variants.map((variant, variantIndex) => (
              <div key={variant.id} className="border p-4 mb-4">
                <div className="mb-2">
                  <label className="block mb-1 font-semibold">Color</label>
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) => handleVariantChange(e, variantIndex, 'color')}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sizes</h4>
                  {variant.sizes.map((size, sizeIndex) => (
                    <div key={sizeIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={size.size}
                        onChange={(e) => handleSizeChange(e, variantIndex, sizeIndex, 'size')}
                        placeholder="Size"
                        className="w-full px-3 py-2 border rounded mr-2"
                      />
                      <input
                        type="number"
                        value={size.price}
                        onChange={(e) => handleSizeChange(e, variantIndex, sizeIndex, 'price')}
                        placeholder="Price"
                        className="w-full px-3 py-2 border rounded mr-2"
                      />
                      <input
                        type="number"
                        value={size.stock}
                        onChange={(e) => handleSizeChange(e, variantIndex, sizeIndex, 'stock')}
                        placeholder="Stock"
                        className="w-full px-3 py-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(variantIndex, sizeIndex)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddSize(variantIndex)}
                    className="mt-2 text-blue-500 hover:text-blue-700"
                  >
                    Add More Sizes
                  </button>
                </div>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(variantIndex)}
                    className="mt-4 text-red-500 hover:text-red-700"
                  >
                    Remove Variant
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddVariant}
              className="text-blue-500 hover:text-blue-700"
            >
              Add More Variants
            </button>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductsPage;
