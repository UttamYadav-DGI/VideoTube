import React from 'react';
import { NavLink } from 'react-router-dom';

// import { 
//   MdHome, 
//   MdVideoLibrary, 
//   MdSubscriptions, 
//   MdHistory, 
//   MdPerson, 
//   MdOndemandVideo 
// } from 'react-icons/md';

const Sidebar = () => {
  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/like',  label: 'Like' },
    { path: '/playlist',  label: 'Playlist' },
    { path: '/subscription',  label: 'Subscriptions' },
    { path: '/user', label: 'User' },
    { path: '/history',  label: 'History' },
    { path:'/logout' , label :'Logout' }
  ];

  return (
    <aside className="w-44 h-screen sticky top-0 bg-white shadow-md p-2 flex flex-col space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700 ${
              isActive ? 'bg-gray-200 font-medium' : ''
            }`
          }
        >
          <span className="text-xl">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
