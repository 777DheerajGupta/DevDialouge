import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        
        {/* Logo or App Name */}
        <div className="text-lg font-bold mb-2 md:mb-0">
          Knowledge Sharing App
        </div>
        
        {/* Links to Other Pages */}
        <div className="flex space-x-4 mb-2 md:mb-0">
          <Link to="/about" className="hover:text-gray-300">
            About
          </Link>
          <Link to="/contact" className="hover:text-gray-300">
            Contact
          </Link>
          <Link to="/privacy-policy" className="hover:text-gray-300">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="hover:text-gray-300">
            Terms of Service
          </Link>
        </div>
        
        {/* Social Media Links */}
        <div className="flex space-x-4">
          <a
            href="https://twitter.com/YourAppHandle"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            Twitter
          </a>
          <a
            href="https://facebook.com/YourAppPage"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            Facebook
          </a>
          <a
            href="https://linkedin.com/company/YourAppCompany"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* Copyright Information */}
      <div className="text-center text-sm mt-4">
        © {new Date().getFullYear()} Knowledge Sharing App. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
