import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Retrieve token from localStorage
  const token = localStorage.getItem('adminToken');

  // If no token is present, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Renders nested routes inside AdminLayout
  return <Outlet />;
};

export default ProtectedRoute;
