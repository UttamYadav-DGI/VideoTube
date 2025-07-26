import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const Subscription = () => {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?._id) {
      fetchSubscribersAndChannels();
    }
  }, [user]);

  const fetchSubscribersAndChannels = async () => {
    try {
      setLoading(true);

      const [subscribersResponse, subscribedChannelsResponse] = await Promise.all([
        axios.get(`https://videotube-1-ncqz.onrender.com/api/v1/subscriptions/c/${user._id}`, {
          withCredentials: true,
        }),
        axios.get(`https://videotube-1-ncqz.onrender.com/api/v1/subscriptions/s/${user._id}`, {
          withCredentials: true,
        }),
      ]);

      setSubscribers(subscribersResponse.data.data || []);
      setSubscribedChannels(subscribedChannelsResponse.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubscription = async (channelId) => {
    try {
      await axios.post(
        `https://videotube-1-ncqz.onrender.com/api/v1/subscriptions/c/${channelId}`,
        {},
        { withCredentials: true }
      );

      const isSubscribed = subscribedChannels.some((channel) => channel._id === channelId);

      if (isSubscribed) {
        setSubscribedChannels((prev) =>
          prev.filter((channel) => channel._id !== channelId)
        );
      } else {
        // Refetch single channel details (optional: ideally you maintain a list or get details on toggle)
        const response = await axios.get(
          `https://videotube-1-ncqz.onrender.com/api/v1/users/${channelId}`,
          { withCredentials: true }
        );
        setSubscribedChannels((prev) => [...prev, response.data.data]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle subscription');
    }
  };

  const isChannelSubscribed = (channelId) => {
    return subscribedChannels.some((channel) => channel._id === channelId);
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Your Subscribers Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Your Subscribers</h2>
        <div className="space-y-4">
          {subscribers.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No subscribers yet</p>
          ) : (
            subscribers.map((subscriber) => (
              <div
                key={subscriber._id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center gap-3">
                  {subscriber.avatar && (
                    <img
                      src={subscriber.avatar}
                      alt={subscriber.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{subscriber.username}</h3>
                    <p className="text-sm text-gray-500">
                      Subscribed since {new Date(subscriber.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Subscribed Channels Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Channels You're Subscribed To</h2>
        <div className="space-y-4">
          {subscribedChannels.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              You haven't subscribed to any channels yet
            </p>
          ) : (
            subscribedChannels.map((channel) => (
              <div
                key={channel._id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center gap-3">
                  {channel.avatar && (
                    <img
                      src={channel.avatar}
                      alt={channel.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{channel.username}</h3>
                    <p className="text-sm text-gray-500">
                      {channel.subscribersCount || 0} subscribers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleSubscription(channel._id)}
                  className={`px-4 py-2 rounded transition-colors ${
                    isChannelSubscribed(channel._id)
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isChannelSubscribed(channel._id) ? 'Unsubscribe' : 'Subscribe'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
