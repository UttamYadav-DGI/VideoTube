import React from "react"; // ✅ Default import
import ReactDOM from 'react-dom/client';
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Header from "../components/Header";
import Home from "../components/Home";
import History from "../components/History";
import Like from "../components/Like";
import Playlist from "../components/Playlist";
import Subscription from "../components/Subscription";
import User from "../components/User";
import Login from "../components/Login.jsx";
import Sidebar from "../components/NavBar";
import './index.css'
import App from './App.jsx'
import Register from "../components/Register.jsx";
import Logout from "../components/Logout.jsx";
const MainRouter=createBrowserRouter([
 
    {path:'/',
    element: <App/>,
    children:[
        {
            path:'/home',
            element:<Home/>,
        },
        {
            path:'/like',
            element:<Like/>
        },
//         {
//   path: '/playlist',
//   children: [
//     {
//       path: '',
//       element: <Playlist />
//     },
//     {
//       path: ':userId',
//       element: <Playlist />
//     }
//   ]
// },
//         {
//             path: 'playlist',
//             children: [
//     {
//       path: '', // matches /playlist
//       element: <Playlist />
//     },
//     {
//       path: ':userId', // matches /playlist/:userId
//       element: <Playlist />
//     }
//   ]
// },   
        {
            path:'/playlist',
            element:<Playlist/>
        },
        {
            path:'/subscription',
            element:<Subscription/>
        },
        {
            path:'/history',
            element:<History/>
        },
        {
            path:'/user',
            element:<User/>
        },
        {
            path:'/logout',
            element:<Logout/>
        },
        {
            path:'/login',
            element:<Login/>
        },
        {
            path:'/register',
            element:<Register/>
        }
    ]
}
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={MainRouter} />
  </React.StrictMode>
);

 