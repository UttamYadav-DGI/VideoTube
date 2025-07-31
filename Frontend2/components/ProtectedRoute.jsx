// components/ProtectedRoute.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-3 p-4 bg-white shadow-lg rounded-xl">
          <span className="w-4 h-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
          <p className="text-gray-700 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not Logged In State
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.91-.816 1.997-1.85l.007-.15V6a2 2 0 00-1.85-1.995L18.938 4H5.062C4.008 4 3.152 4.816 3.065 5.85L3.058 6v12c0 1.054.816 1.91 1.85 1.997l.15.007z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You must log in to access this page.</p>
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // If Authenticated → Render the Child Component
  return children;
};

export default ProtectedRoute;
