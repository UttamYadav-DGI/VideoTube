import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Subscription = () => {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?._id) {
      fetchSubscriptions();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    try {
      // Fetch "Your Subscribers"
      const subsRes = await axios.get(
        `https://videotube-1-ncqz.onrender.com/api/v1/subscriptions/c/${user._id}`,
        { withCredentials: true }
      );
      // Flatten subscriber arrays
      const subscriberList =
        subsRes.data?.data?.flatMap((item) => item.subscribers || []) || [];
      setSubscribers(subscriberList);

      // Fetch "Channels You're Subscribed To"
      const channelsRes = await axios.get(
        `https://videotube-1-ncqz.onrender.com/api/v1/subscriptions/s/${user._id}`,
        { withCredentials: true }
      );
      // Flatten subscribed channels
      const channelsList =
        channelsRes.data?.data?.flatMap((item) => item.subscribedTo || []) || [];
      setSubscribedChannels(channelsList);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      
      {/* Your Subscribers */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Your Subscribers</h2>
        {subscribers.length === 0 ? (
          <p className="text-gray-500">No subscribers yet</p>
        ) : (
          <div className="space-y-4">
            {subscribers.map((sub) => (
              <div
                key={sub._id}
                className="flex items-center p-4 bg-white rounded-xl shadow"
              >
                <img
                  src={sub.avatar}
                  alt={sub.username}
                  className="w-12 h-12 rounded-full border object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-semibold">{sub.username}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Channels You're Subscribed To */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Channels You're Subscribed To</h2>
        {subscribedChannels.length === 0 ? (
          <p className="text-gray-500">You haven't subscribed to any channels</p>
        ) : (
          <div className="space-y-4">
            {subscribedChannels.map((channel) => (
              <div
                key={channel._id}
                className="flex items-center p-4 bg-white rounded-xl shadow"
              >
                <img
                  src={channel.avatar}
                  alt={channel.username}
                  className="w-12 h-12 rounded-full border object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-semibold">{channel.username}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Subscription;
