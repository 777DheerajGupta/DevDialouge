import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  // Get authentication status from the Redux store
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If authenticated, render child components; if not, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
