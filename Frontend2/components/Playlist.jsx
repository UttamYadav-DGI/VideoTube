import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "https://videotube-1-ncqz.onrender.com";

const Playlist = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    videoId: "",
  });

  // ✅ Fetch playlists when user changes
  useEffect(() => {
    if (user?._id) fetchUserPlaylists();
  }, [user?._id]);

  // ✅ Auto clear error after 4s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchUserPlaylists = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/api/v1/playlists/user/${user._id}`,
        { withCredentials: true }
      );
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
        `${API_BASE}/api/v1/playlists/update-playlist/${playlistId}`,
        updatedData,
        { withCredentials: true }
      );
      setPlaylists((prev) =>
        prev.map((p) => (p._id === playlistId ? { ...p, ...updatedData } : p))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update playlist");
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;

    try {
      await axios.delete(
        `${API_BASE}/api/v1/playlists/delete-playlist/${playlistId}`,
        { withCredentials: true }
      );
      setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete playlist");
    }
  };

  const handleRemoveVideo = async (playlistId, videoId) => {
    try {
      await axios.patch(
        `${API_BASE}/api/v1/playlists/remove/${playlistId}/${videoId}`,
        {},
        { withCredentials: true }
      );
      setPlaylists((prev) =>
        prev.map((p) =>
          p._id === playlistId
            ? { ...p, videos: p.videos.filter((v) => v._id !== videoId) }
            : p
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to remove video from playlist"
      );
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE}/api/v1/playlists/create-playlist`,
        {
          name: formData.name,
          description: formData.description,
          videoId: formData.videoId || undefined, // ✅ optional
        },
        { withCredentials: true }
      );
      setPlaylists((prev) => [...prev, res.data.data]);
      setFormData({ name: "", description: "", videoId: "" });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create playlist");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Create Playlist Button/Form */}
      <div className="mb-8">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            + Create New Playlist
          </button>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Playlist</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <input
                type="text"
                placeholder="Playlist Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Video ID (optional)"
                value={formData.videoId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, videoId: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
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
                      const newName = prompt(
                        "Enter new playlist name:",
                        playlist.name
                      );
                      const newDescription = prompt(
                        "Enter new description:",
                        playlist.description
                      );
                      if (newName !== null && newDescription !== null) {
                        handleUpdatePlaylist(playlist._id, {
                          name: newName || playlist.name,
                          description: newDescription || playlist.description,
                        });
                      }
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePlaylist(playlist._id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Videos in playlist */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Videos in playlist:
                </h4>
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
                          className="text-sm text-red-600 hover:text-red-800"
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
