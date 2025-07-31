import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/NavBar";
import { AuthProvider } from "../components/AuthContext";
import { ThemeProvider } from "../components/ThemeContext";
import ProtectedRoute from "../components/ProtectedRoute"; // ✅ Import correctly

const App = () => {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <ThemeProvider>
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-4">
                <Outlet />
              </main>
            </div>
          </div>
        </ThemeProvider>
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default App;
