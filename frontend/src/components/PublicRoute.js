import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ token, children }) => {
  if (token) {
    // If a token exists, the user is already authenticated.
    return <Navigate to="/member" />;
  }
  return children;
};

export default PublicRoute;
