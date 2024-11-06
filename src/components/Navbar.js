import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice'; // Adjust the path according to your file structure

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage items
    dispatch(logout()); // Dispatch logout action to clear Redux state
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Your App Name
            </Link>
          </div>

          {/* <nav className="bg-gray-800 text-white p-4">
            {/* <Link to="/" className="mr-4">Home</Link> */}
            {/* <Link to="/trending" className="mr-4">Trending Topics</Link> */}
            {/* Add other links like Login, Signup, Dashboard */}
          {/* </nav> */}

          <div className="flex items-center space-x-4">
            <Link
              to="/ask-gemini"
              className="px-4 py-2 text-sm font-medium text-white bg-[#008069] hover:bg-[#006d59] rounded-md transition-colors flex items-center gap-2"
            >
              <i className="fas fa-robot"></i>
              Ask Gemini
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
