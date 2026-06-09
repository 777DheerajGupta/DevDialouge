import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content wrapper */}
      <div className="fixed inset-0 flex flex-col pointer-events-none">
        {/* Header */}
        <header className="backdrop-blur-md bg-white/5 border-b border-white/10 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
            <Link to="/" className="flex items-center gap-2 w-fit group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gradient group-hover:opacity-80 transition-opacity">
                DevDialogue
              </span>
            </Link>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 pointer-events-auto relative z-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <footer className="backdrop-blur-md bg-white/5 border-t border-white/10 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="text-gray-400 text-center sm:text-left">
                © {new Date().getFullYear()} DevDialogue. All rights reserved.
              </div>
              <div className="flex gap-4 sm:gap-6">
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Terms
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;