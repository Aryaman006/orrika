import React, { useState, useEffect } from 'react';
import { databases, storage } from '../context/appwrite';
import { ID } from 'appwrite';
import { toast } from 'react-toastify';

const SliderManager = ({ onBack }) => {
  const [sliders, setSliders] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  useEffect(() => {
    fetchSliders();
  }, []);


  const fetchSliders = async () => {
    try {
      const result = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_SLIDER_ID
      );
      setSliders(result.documents);
    } catch (error) {
      toast.error('Failed to fetch sliders', error);
    }
  };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     try {
//       const response = await storage.createFile(
//         process.env.NEXT_PUBLIC_APPWRITE_SLIDER_BUCKET_ID,
//         file
//       );
//       const url = storage.getFileView(
//         process.env.NEXT_PUBLIC_APPWRITE_SLIDER_BUCKET_ID,
//         response.$id
//       );
//       setImg(url);
//     } catch (error) {
//       toast.error('Image upload failed', error);
//     }
//   };


const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
        toast.error('No file selected');
        return;
    }

    try {
        const response = await storage.createFile(
            process.env.NEXT_PUBLIC_APPWRITE_SLIDER_BUCKET_ID, // Your bucket ID
            ID.unique(),  // Generates a unique ID for the file
            file  // Pass the selected file object
        );

        // Generate the URL to view the file
        const url = storage.getFileView(
            process.env.NEXT_PUBLIC_APPWRITE_SLIDER_BUCKET_ID,
            response.$id
        );

        setImg(url); // Store the image URL in the state
    } catch (error) {
        toast.error('Image upload failed', error);
    }
};

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sliderData = {
        title,
        description,
        img
      };

      if (editingId) {
        await databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_SLIDER_ID,
          editingId,
          sliderData
        );
      } else {
        await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_SLIDER_ID,
          'unique()',
          sliderData
        );
      }
      resetForm();
      fetchSliders();
    } catch (error) {
      toast.error('Failed to save slider', error);
    }
  };

  const handleEdit = (slider) => {
    setTitle(slider.title);
    setDescription(slider.description);
    setImg(slider.img);
    setEditingId(slider.$id);
  };

  const handleDelete = async (id) => {
    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_SLIDER_ID,
        id
      );
      fetchSliders();
    } catch (error) {
      toast.error('Failed to delete slider', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImg('');
    setEditingId(null);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <button
        onClick={onBack}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Back
      </button>
      <h2 className="text-2xl font-semibold mb-4">Slider Manager</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          onChange={handleImageUpload}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? 'Update Slider' : 'Add Slider'}
        </button>
        {editingId && (
          <button
            onClick={resetForm}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      <h3 className="text-xl font-semibold mt-6 mb-4">Existing Sliders</h3>
      <ul className="space-y-4">
        {sliders.map((slider) => (
          <li key={slider.$id} className="p-4 bg-white rounded-lg shadow">
            <img
              src={slider.img}
              alt={slider.title}
              className="w-full h-32 object-cover rounded"
            />
            <div className="mt-2">
              <h4 className="text-lg font-semibold">{slider.title}</h4>
              <p className="text-gray-600">{slider.description}</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(slider)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(slider.$id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SliderManager;
