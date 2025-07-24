import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
const Playlist = () => {
  // const { userId } = useParams();
  const {user}=useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    videoId: ""
  });

  useEffect(() => {

    if(user?._id)fetchUserPlaylists();
  }, []);

  const fetchUserPlaylists = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/playlists/user/${user._id}`, {
        withCredentials: true
      });
      setPlaylists(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch playlists");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlaylist = async (playlistId, updatedData) => {
  try {
    await axios.patch(
      `http://localhost:3000/api/v1/playlists/update-playlist/${playlistId}`,
      updatedData,
      { withCredentials: true }
    );
    fetchUserPlaylists(); // Refresh playlists after update
  } catch (err) {
    setError(err.response?.data?.message || "Failed to update playlist");
  }
};

const handleDeletePlaylist = async (playlistId) => {
  if (!window.confirm("Are you sure you want to delete this playlist?")) return;
  
  try {
    await axios.delete(
      `http://localhost:3000/api/v1/playlists/delete-playlist/${playlistId}`,
      { withCredentials: true }
    );
    fetchUserPlaylists(); // Refresh playlists after deletion
  } catch (err) {
    setError(err.response?.data?.message || "Failed to delete playlist");
  }
};

const handleRemoveVideo = async (playlistId, videoId) => {
  try {
    await axios.patch(
      `http://localhost:3000/api/v1/playlists/remove/${playlistId}/${videoId}`,
      {},
      { withCredentials: true }
    );
    fetchUserPlaylists(); // Refresh playlists after removing video
  } catch (err) {
    setError(err.response?.data?.message || "Failed to remove video from playlist");
  }
};

   const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:3000/api/v1/playlists/create-Playlist/${formData.videoId}`,
        {
          name: formData.name,
          description: formData.description,
        },
        { withCredentials: true }
      );
      setFormData({ name: "", description: "", videoId: "" });
      setShowForm(false); // Hide form after creation
      fetchUserPlaylists();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create playlist");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Create Playlist Button/Form */}
      <div className="mb-8">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Playlist
          </button>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Playlist</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              {/* ... existing form fields ... */}
               <div>
    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
      Playlist Name
    </label>
    <input
      type="text"
      id="name"
      name="name"
      value={formData.name}
      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
      required
    />
  </div>

  <div>
    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
      Description
    </label>
    <textarea
      id="description"
      name="description"
      value={formData.description}
      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
      required
    />
  </div>

  <div>
    <label htmlFor="videoId" className="block text-sm font-medium text-gray-700">
      Video ID
    </label>
    <input
      type="text"
      id="videoId"
      name="videoId"
      value={formData.videoId}
      onChange={(e) => setFormData(prev => ({ ...prev, videoId: e.target.value }))}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
      required
    />
  </div>
  <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Create Playlist
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
</form>

              
           
          </div>
        )}
      </div>

      {/* Playlists List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
        {playlists.length === 0 ? (
          <p className="text-center text-gray-500">No playlists found</p>
        ) : (
         playlists.map((playlist) => (
  <div key={playlist._id} className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold">{playlist.name}</h3>
        <p className="text-gray-600 mt-1">{playlist.description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            const newName = prompt("Enter new playlist name:", playlist.name);
            const newDescription = prompt("Enter new description:", playlist.description);
            if (newName || newDescription) {
              handleUpdatePlaylist(playlist._id, {
                name: newName || playlist.name,
                description: newDescription || playlist.description
              });
            }
          }}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeletePlaylist(playlist._id)}
          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>

    {/* Videos in playlist */}
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Videos in playlist:</h4>
      <div className="space-y-2">
        {playlist.videos?.length > 0 ? (
          playlist.videos.map((video) => (
            <div 
              key={video._id} 
              className="flex justify-between items-center bg-gray-50 p-3 rounded"
            >
              <div className="flex items-center gap-3">
                {video.thumbnail && (
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-16 h-9 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{video.title}</p>
                  <p className="text-sm text-gray-500">
                    {video.views || 0} views
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveVideo(playlist._id, video._id)}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-3">
            No videos in this playlist
          </p>
        )}
      </div>
    </div>
  </div>
))
        )}
      </div>
    </div>
  );
};

export default Playlist;