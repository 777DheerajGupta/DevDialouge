import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', path: '/', icon: '🏠' },
    { name: 'Create Post', path: '/create-post', icon: '📝' },
    { name: 'Ask Question', path: '/ask-question', icon: '❓' },
    { name: 'Topics', path: '/trending', icon: '📚' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)]">
      <div className="p-4">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-md
                ${location.pathname === item.path
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 