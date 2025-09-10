import React from "react";
import { VideoProvider } from "../components/VideoContext";

import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/NavBar";
import { AuthProvider, useAuth } from "../components/AuthContext";
import Login from "../components/Login";
import Register from "../components/Register";

const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Checking authentication...
      </div>
    );
  }

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (!user && !isPublicRoute) {
    // Redirect to login if trying to access protected page
    return <Navigate to="/login" replace />;
  }

  if (isPublicRoute) {
    return location.pathname === "/login" ? <Login /> : <Register />;
  }

  // Authenticated layout
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <VideoProvider>
      <AppContent />
      </VideoProvider>
    </AuthProvider>
  );
};

export default App;
