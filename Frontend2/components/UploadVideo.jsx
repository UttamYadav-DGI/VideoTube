import React, { useState } from "react";
import axios from "axios";
import { useVideos } from "./VideoContext";

const UploadVideo = ({ onClose }) => {
       const { refreshVideos } = useVideos();

  const [videofile, setVideofile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {

    if (!videofile || !thumbnail || !title || !description) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('videofile', videofile);
    formData.append('thumbnail', thumbnail);
    formData.append('title', title);
    formData.append('description', description);

    try {
      setLoading(true);
      const response = await axios.post(
        'https://videotube-1-ncqz.onrender.com/api/v1/videos',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );
      alert('Video uploaded successfully!');
      console.log(response.data);
      onClose(); // ✅ Close modal after successful upload
       refreshVideos(); 
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Video upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg">
          ×
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Upload Video</h2>

        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          placeholder="Title"
          className="block mb-3 border p-2 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block mb-1 font-medium">Description</label>
        <textarea
          placeholder="Description"
          className="block mb-3 border p-2 w-full rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="block mb-1 font-medium">Video File</label>
        <input
          type="file"
          accept="video/*"
          className="block mb-3"
          onChange={(e) => setVideofile(e.target.files[0])}
        />

        <label className="block mb-1 font-medium">Thumbnail Image</label>
        <input
          type="file"
          accept="image/*"
          className="block mb-4"
          onChange={(e) => setThumbnail(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default UploadVideo;