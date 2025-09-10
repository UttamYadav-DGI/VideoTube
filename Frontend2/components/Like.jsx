import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Like = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const fetchLikedVideos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://videotube-1-ncqz.onrender.com/api/v1/likes/video", {
        withCredentials: true,
      }); 
      const videos = res.data?.data || [];
      {console.log(res)}
      setLikedVideos(Array.isArray(videos) ? videos : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch liked videos");
    } finally {
      setLoading(false);
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
                  <span className="text-green-600 font-medium">Liked</span>
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
