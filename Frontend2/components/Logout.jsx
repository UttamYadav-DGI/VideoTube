import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/users/logout",
          {},
          {
            withCredentials: true, // This is required to send cookies
          }
        );

        console.log("Logout successful:", response.data.message);

        // Optional: Clear localStorage or context state
        localStorage.removeItem("user");

        // Redirect to login or home
        navigate("/login");
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
