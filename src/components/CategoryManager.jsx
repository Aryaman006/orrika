import { useState, useEffect } from 'react';
import { Client, Databases, Storage } from 'appwrite';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify'; // Import toast


const CategoryManager = ({ onBack }) => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [updateCategory, setUpdateCategory] = useState(null);
  const [updateCategoryName, setUpdateCategoryName] = useState('');
  const [updateCategoryImage, setUpdateCategoryImage] = useState(null);
console.log(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const client = new Client();
  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const databases = new Databases(client);
  const storage = new Storage(client);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_ID
      );
      setCategories(response.documents);
    } catch (error) {
      toast.error('Failed to fetch categories:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      let imageUrl = '';
      if (newCategoryImage) {
        const fileId = uuidv4();
        const response = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
          fileId,
          newCategoryImage
        );
        imageUrl = storage.getFileView(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
          response.$id
        ).href;
      }

      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_ID,
        uuidv4(),
        {
          category: newCategoryName,
          image: imageUrl,
        }
      );
      setNewCategoryName('');
      setNewCategoryImage(null);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to add category:', error);
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    try {
      let imageUrl = '';
      if (updateCategoryImage) {
        const fileId = uuidv4();
        const response = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
          fileId,
          updateCategoryImage
        );
        imageUrl = storage.getFileView(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
          response.$id
        ).href;
      }

      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_ID,
        categoryId,
        {
          name: updateCategoryName,
          image: imageUrl || undefined,
        }
      );
      setUpdateCategory(null);
      setUpdateCategoryName('');
      setUpdateCategoryImage(null);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_ID,
        categoryId
      );
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category:', error);
    }
  };

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Add New Category</h3>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Category Name"
        />
        <input
          type="file"
          onChange={(e) => handleImageChange(e, setNewCategoryImage)}
          className="mt-2"
        />
        <button
          onClick={handleAddCategory}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Category
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Existing Categories</h3>
      {categories.map((category) => (
        <div key={category.$id} className="mb-4 p-4 border rounded">
          {updateCategory === category.$id ? (
            <>
              <input
                type="text"
                value={updateCategoryName}
                onChange={(e) => setUpdateCategoryName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Category Name"
              />
              <input
                type="file"
                onChange={(e) => handleImageChange(e, setUpdateCategoryImage)}
                className="mt-2"
              />
              <button
                onClick={() => handleUpdateCategory(category.$id)}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Update Category
              </button>
              <button
                onClick={() => setUpdateCategory(null)}
                className="mt-2 ml-2 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="font-semibold">{category.name}</p>
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="mt-2 w-32 h-32 object-cover"
                />
              )}
              <button
                onClick={() => {
                  setUpdateCategory(category.$id);
                  setUpdateCategoryName(category.name);
                }}
                className="mt-2 text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCategory(category.$id)}
                className="mt-2 ml-2 text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryManager;