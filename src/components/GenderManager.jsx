import { useState, useEffect } from 'react';
import { Client, Databases, Storage } from 'appwrite';
import { v4 as uuidv4 } from 'uuid';


const GenderManager = ({onBack}) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [genders, setGenders] = useState([]);
  const [loading, setLoading] = useState(false);

  const client = new Client();
  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const databases = new Databases(client);
  const storage = new Storage(client);

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_GENDER_ID
        );
        setGenders(response.documents);
      } catch (error) {
      }
    };
    fetchGenders();
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!name || !image) {
        throw new Error('Name and image are required.');
      }

      const fileId = uuidv4();
      const response = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        fileId,
        image
      );

      const imageUrl = storage.getFileView(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        response.$id
      ).href;

      const genderData = {
        name,
        img: imageUrl,
      };

      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_GENDER_ID,
        uuidv4(),
        genderData
      );

      alert('Gender added successfully!');
      setName('');
      setImage(null);
      setLoading(false);
      // Fetch updated gender list
      const updatedGenders = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_GENDER_ID
      );
      setGenders(updatedGenders.documents);
    } catch (error) {
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <button onClick={onBack} className="text-blue-500 mb-4 hover:underline">← Back</button>
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">Manage Gender</h2>
        <form onSubmit={handleSubmit} className="mb-6">
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
            <label className="block mb-2 font-semibold">Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        <h3 className="text-xl font-bold mb-4">Existing Genders</h3>
        <ul>
          {genders.map((gender) => (
            <li key={gender.$id} className="mb-4">
              <img src={gender.img} alt={gender.name} className="w-16 h-16 object-cover mb-2" />
              <p>{gender.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenderManager;
