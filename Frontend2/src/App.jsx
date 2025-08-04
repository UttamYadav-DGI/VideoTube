import React from "react";
import { Outlet, useLocation } from "react-router-dom";
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

  // Public pages allowed without login
  const publicRoutes = ["/login", "/register"];

  // If user not logged in and not on login/register → redirect to login
  if (!user && !publicRoutes.includes(location.pathname)) {
    return <Login />;
  }

  // If logged in → show the full app
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

  // If not logged in but on login/register → show that page
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
