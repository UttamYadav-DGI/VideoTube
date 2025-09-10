import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        'https://videotube-1-ncqz.onrender.com/api/v1/history',
        { withCredentials: true }
      );
        console.log("Res",response);

      setHistory(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromHistory = async (videoId) => {
    try {
      await axios.delete(
        `https://videotube-1-ncqz.onrender.com/api/v1/history/${videoId}`,
        { withCredentials: true }
      );
      fetchHistory(); // Refresh history after removal
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove from history');
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your entire history?')) {
      return;
    }

    try {
      await axios.delete(
        'https://videotube-1-ncqz.onrender.com/api/v1/history',
        { withCredentials: true }
      );
      setHistory([]); // Clear local state
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear history');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Watch History</h1>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear History
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No watch history found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {history.map((item) => (
            <div 
              key={item._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {item.video?.thumbnail && (
                <img
                  src={item.video.thumbnail}
                  alt={item.video.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => navigate(`/video/${item.video._id}`)}
                />
              )}
              <div className="p-4">
                <h3 
                  className="font-medium text-gray-900 mb-2 cursor-pointer"
                  onClick={() => navigate(`/video/${item.video._id}`)}
                >
                  {item.video?.title}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleRemoveFromHistory(item.video?._id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;