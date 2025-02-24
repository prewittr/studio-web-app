// PublicRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PublicRoute = ({ children }) => {
  const { token, initialized } = useAuth();
  const location = useLocation(); // Get current location
  console.log("PublicRoute - initialized:", initialized, "token:", token);

  if (!initialized) {
    console.log("PublicRoute - Loading...");
    return <div>Loading...</div>;
  }

  // Allow access to /cart even if token exists
  if (token && !location.state?.from === "/cart") {
    console.log("PublicRoute - Redirecting to /member");
    return <Navigate to="/member" />;
    
  }

  console.log("PublicRoute - Rendering children");
  return children;
};

export default PublicRoute;
