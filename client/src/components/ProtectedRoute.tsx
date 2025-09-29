import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  // Check the authentication token exists in local storage or not
  const token = localStorage.getItem('token');

  // If token exists, render the nested routes Dashboard
  // If not, redirect the user to the login page
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;