import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/NavBar";
import { AuthProvider, useAuth } from "../components/AuthContext";
import { ThemeProvider } from "../components/ThemeContext";
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

  // Public pages
  const publicRoutes = ["/login", "/register"];

  // Not logged in → send to login
  if (!user && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  // Logged in and trying to go to login/register → send to home
  if (user && publicRoutes.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  // Logged in → show app
  if (user) {
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
  }

  // Not logged in but on login/register page → show that page
  if (!user && location.pathname === "/login") return <Login />;
  if (!user && location.pathname === "/register") return <Register />;

  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
