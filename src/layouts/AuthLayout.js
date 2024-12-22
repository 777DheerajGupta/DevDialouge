import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Simple header for auth pages */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="text-xl font-bold text-gray-800">
            DevDialouge
          </Link>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg p-8">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Simple footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Your App Name. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout; 
