import React, { useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axios.post(
          "https://videotube-1-ncqz.onrender.com/api/v1/users/logout",
          {},
          { withCredentials: true }
        
        );
 
        // Clear storage & redirect
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Logout failed. Please try again.");
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium text-gray-700">Logging you out...</p>
    </div>
  );
};

export default Logout;
