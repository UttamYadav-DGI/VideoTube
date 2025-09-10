// Header.jsx
import React, { useEffect, useState } from "react";
import Home from "./Home";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import UploadVideo from './UploadVideo'; // Import the new component

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleLogin = () => navigate('/login');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
  };
  const handleUploadClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      setShowUploadModal(true);
    }
  };

  return (
    <>
      {showUploadModal && <UploadVideo onClose={() => setShowUploadModal(false)} />}

      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/home')}>
              <img 
                className="h-8 w-auto" 
                src="https://logos-world.net/wp-content/uploads/2020/04/YouTube-Logo.png" 
                alt="YouTube Logo" 
              />
            </div>

            <div className="flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
                  placeholder="Search videos..."
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleUploadClick}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Upload
              </button>

              {user ? (
                <div className="flex items-center space-x-3">
                  <img
                  onClick={ ()=>{navigate('/user')} }
                    className="h-8 w-8 rounded-full"
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`}
                    alt={user.username}
                  />
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
    export default Header;