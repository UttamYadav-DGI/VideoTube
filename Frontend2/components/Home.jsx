import React, { useEffect, useState } from "react";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likes, setLikes] = useState({});
  const [subscribed, setSubscribed] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://videotube-1-ncqz.onrender.com/api/v1/videos", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch videos");
      const jsonData = await res.json();
      setVideos(jsonData.data || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleLike = (videoId) => {
    setLikes((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
    // TODO: Optional - call backend to persist like
  };

  const handleSubscribe = (videoId) => {
    setSubscribed((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
    // TODO: Optional - call backend to persist subscription
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {videos.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">No videos found.</div>
      ) : (
        videos.map((video) => (
          <div key={video._id} className="bg-white shadow rounded p-4 flex flex-col">
            {video.videofile ? (
              <video
                controls
                src={video.videofile}
                className="w-full h-48 rounded mb-3 object-cover"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={video.thumbnail || "/placeholder.jpg"}
                alt={video.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}

            <h2 className="text-lg font-semibold mb-1 truncate">{video.title}</h2>
            <p className="text-gray-600 text-sm line-clamp-2">{video.description}</p>
            <span className="text-xs text-gray-400 mt-1 mb-2">Views: {video.views || 0}</span>

            <div className="flex items-center justify-between gap-2 mt-auto">
              <button
                onClick={() => handleLike(video._id)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  likes[video._id]
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {likes[video._id] ? "Liked" : "Like"}
              </button>

              <button
                onClick={() => handleSubscribe(video._id)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  subscribed[video._id]
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {subscribed[video._id] ? "Subscribed" : "Subscribe"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
