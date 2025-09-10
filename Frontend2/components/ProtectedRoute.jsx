import React from "react";
import { useAuth } from "../components/AuthContext"; // ✅ match exact relative path
import { Link } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Checking authentication...</div>;
  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">Please log in to access this page.</p>
        <Link to="/login" className="text-blue-500 underline">
        </Link>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
