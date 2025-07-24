import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Register from "./Register";
import axios from "axios";
const Login = () => {
    const Navigate=useNavigate();
    const [formData,setFormData]=useState({username:"",email:"",password:""});
    const [error,setError]=useState(null);
    const handlingInputChanges = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError("");
    try{const res=await axios.post("http://localhost:3000/api/v1/users/login",formData,{
        headers:{"Content-Type":"application/json"},
        withCredentials:true,
    });
    Navigate("/home");
    }
    catch(error){
        setError(error.response?.data?.message || "login failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username / ID
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handlingInputChanges}
              placeholder="Enter username or ID"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
               value={formData.password}
              onChange={handlingInputChanges}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;