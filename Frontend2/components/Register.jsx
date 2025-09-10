import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  // Handle input & file change
  const handleInputChange = (e) => {
    const { id, type, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "file" ? files[0] : value,
    }));
  };

  // Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("fullname", formData.fullname);
    data.append("email", formData.email);
    data.append("username", formData.username);
    data.append("password", formData.password);
    if (formData.avatar) data.append("avatar", formData.avatar);
    if (formData.coverImage) data.append("coverImage", formData.coverImage);

    try {
      const res = await axios.post("https://videotube-1-ncqz.onrender.com/api/v1/users/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(res.data.message);
    } catch (error) {
      console.error("Registration error:", error?.response?.data || error.message);
      alert("Registration failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              id="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username"
              value={formData.username}
              onChange={handleInputChange}
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;