import React, { useState, useEffect } from 'react';
import axios from 'axios';

const User = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    avatar: null,
    coverImage: null
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("https://videotube-1-ncqz.onrender.com/api/v1/users/current-user", {
        withCredentials: true
      });
      setUser(res.data.data);
      setFormData({
        fullname: res.data.data.fullname || "",
        email: res.data.data.email || "",
        username: res.data.data.username || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      await axios.patch(
        "https://videotube-1-ncqz.onrender.com/api/v1/users/update-account",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      await fetchUserData();
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;
  if (!user) return <div className="text-center mt-8">No user data found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="relative h-48">
          <img
            src={user.coverImage || "/default-cover.jpg"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <img
            src={user.avatar || "/default-avatar.jpg"}
            alt="Avatar"
            className="absolute -bottom-10 left-6 w-24 h-24 rounded-full border-4 border-white object-cover"
          />
        </div>

        <div className="pt-16 px-6 pb-6">
          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  id="fullname"
                  type="text"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Avatar</label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="mt-1 block w-full"
                />
              </div>

              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image</label>
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="mt-1 block w-full"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{user.fullname}</h1>
              <p className="text-gray-600">@{user.username}</p>
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;