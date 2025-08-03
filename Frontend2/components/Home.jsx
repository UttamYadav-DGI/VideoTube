import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likeLoadingId, setLikeLoadingId] = useState(null);
  const [subLoadingId, setSubLoadingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://videotube-1-ncqz.onrender.com/api/v1/videos", {
        withCredentials: true,
      });
      setVideos(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (videoId) => {
    setLikeLoadingId(videoId);
    try {
      await axios.post(
        `https://videotube-1-ncqz.onrender.com/api/v1/likes/video-like/v/${videoId}`,
        {},
        { withCredentials: true }
      );
      // Optionally update UI or refetch videos
    } catch (err) {
      alert("Error liking video: " + (err.response?.data?.message || "Unknown"));
    } finally {
      setLikeLoadingId(null);
    }
  };

  const handleSubscribe = async (channelId) => {
    setSubLoadingId(channelId);
    try {
      await axios.post(
        `https://videotube-1-ncqz.onrender.com/api/v1/subscriptions/c/${channelId}`,
        {},
        { withCredentials: true }
      );
      // Optionally update UI or show toast
    } catch (err) {
      alert("Error subscribing: " + (err.response?.data?.message || "Unknown"));
    } finally {
      setSubLoadingId(null);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {videos.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">No videos found.</div>
      ) : (
        videos.map((video) => (
          
          <div
            key={video._id}
            className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition hover:shadow-lg"
          >
            {video.videofile ? (
              <video
                controls
                src={video.videofile}
                className="w-full h-48 object-cover"
              />
            ) : (
              <img
                src={video.thumbnail || "/placeholder.jpg"}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1 truncate">{video.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{video.description}</p>
                <span className="text-xs text-gray-400 block mb-3">Views: {video.views || 0}</span>
              </div>

              <div className="flex justify-between items-center mt-auto">
                <button
                  onClick={() => handleLike(video._id)}
                  disabled={likeLoadingId === video._id}
                  className="bg-pink-100 text-pink-600 px-3 py-1 text-sm rounded hover:bg-pink-200 transition"
                >
                  {likeLoadingId === video._id ? "Liking..." : "Like ❤️"}
                </button>
                <button
                  onClick={() => handleSubscribe(video._id)}
                  disabled={subLoadingId === video._id}
                  className="bg-blue-100 text-blue-600 px-3 py-1 text-sm rounded hover:bg-blue-200 transition"
                >
                  {subLoadingId === video._id ? "Subscribing..." : "Subscribe 🔔"}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
