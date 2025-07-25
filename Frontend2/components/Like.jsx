import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Like = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const fetchLikedVideos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://videotube-1-ncqz.onrender.com/api/v1/likes/videos", {
        withCredentials: true
      });
      // Check if response has data property and it contains videoDetail
      const videos = res.data?.data || [];
      setLikedVideos(Array.isArray(videos) ? videos : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch liked videos");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (videoId) => {
    if (!videoId || toggleLoading) return;
    
    setToggleLoading(true);
    setError("");
    
    try {
      await axios.post(
        `https://videotube-1-ncqz.onrender.com/api/v1/likes/toggle/v/${videoId}`,
        {},
        { withCredentials: true }
      );
      await fetchLikedVideos(); // Refresh the list after toggle
    } catch (err) {
      console.error("Toggle error:", err);
      setError(err.response?.data?.message || "Failed to toggle like");
    } finally {
      setToggleLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {likedVideos.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No liked videos found.
          </div>
        ) : (
          likedVideos.map((video) => (
            <div key={video._id} className="bg-white shadow rounded-lg overflow-hidden">
              {video.thumbnail && (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {video.views || 0} views
                  </span>
                  <button
                    onClick={() => handleToggleLike(video._id)}
                    disabled={toggleLoading}
                    className={`px-4 py-2 rounded ${
                      toggleLoading 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'text-red-500 hover:text-red-600'
                    }`}
                  >
                    {toggleLoading ? 'Processing...' : 'Unlike'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Like;