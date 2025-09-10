// src/context/VideoContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const VideoContext = createContext();
export const useVideos = () => useContext(VideoContext);

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch videos initially
  useEffect(() => {
    refreshVideos();
  }, []);

  // 🔹 Normal fetch (full refresh)
  const refreshVideos = async () => {rm -rf .git rm -rf .git 
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://videotube-1-ncqz.onrender.com/api/v1/videos", {
        withCredentials: true,
      });

      const videosWithState = res.data?.data?.map((video) => ({
        ...video,
        liked: video.liked || false,
        subscribed: video.subscribed || false,
      }));

      setVideos(videosWithState || []);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Optimistic Like Update (fast, no full refetch)
  const toggleLike = async (videoId, newLikedState) => {
    setVideos((prev) =>
      prev.map((video) =>
        video._id === videoId ? { ...video, liked: newLikedState } : video
      )
    );

    try {
      await axios.post(
        `https://videotube-1-ncqz.onrender.com/api/v1/likes/video-like/v/${videoId}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      // rollback if failed
      setVideos((prev) =>
        prev.map((video) =>
          video._id === videoId ? { ...video, liked: !newLikedState } : video
        )
      );
      console.error("Error liking video:", err);
    }
  };

  // 🔹 Optimistic Subscribe Update
  const toggleSubscribe = async (channelId, newSubState) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.owner === channelId
          ? { ...video, subscribed: newSubState }
          : video
      )
    );

    try {
      await axios.post(
        `https://videotube-1-ncqz.onrender.com/api/v1/subscriptions/c/${channelId}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      // rollback if failed
      setVideos((prev) =>
        prev.map((video) =>
          video.owner === channelId
            ? { ...video, subscribed: !newSubState }
            : video
        )
      );
      console.error("Error subscribing:", err);
    }
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        loading,
        error,
        refreshVideos,
        toggleLike,
        toggleSubscribe,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
