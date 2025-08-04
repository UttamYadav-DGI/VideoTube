import React from "react";
import {Outlet, Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/NavBar";
import { AuthProvider } from "../components/AuthContext";
import { ThemeProvider } from "../components/ThemeContext";
import Login from "../components/Login";
import Register from "../components/Register";
import ProtectedRoute from "../components/ProtectedRoute";

const Layout = () => (
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

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/dashboard" element={<div>Dashboard</div>} />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
