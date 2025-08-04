import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import Home from "../components/Home";
import History from "../components/History";
import Like from "../components/Like";
import Playlist from "../components/Playlist";
import Subscription from "../components/Subscription";
import User from "../components/User";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import Logout from "../components/Logout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx"; // ✅ New

import "./index.css";

const MainRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Protected routes
      {
        element: <ProtectedRoute />, // Wrap protected pages
        children: [
          { path: "/home", element: <Home /> },
          { path: "/like", element: <Like /> },
          { path: "/playlist", element: <Playlist /> },
          { path: "/subscription", element: <Subscription /> },
          { path: "/history", element: <History /> },
          { path: "/user", element: <User /> },
          { path: "/logout", element: <Logout /> },
        ],
      },

      // Public routes
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={MainRouter} />
  </React.StrictMode>
);
