import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from './Spinner';

const ProtectedRoute = ({ token, allowedRoles, children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Simulate asynchronous verification (e.g. token validation)
    const verifyToken = () => {
      if (token) {
        // Attempt to decode the token to extract the user role.
        try {
          const payload = JSON.parse(atob(token.split('.')[1])); // decode base64 payload
          const userRole = payload.role;
          // If allowedRoles is provided, check if the user's role is allowed.
          if (allowedRoles && allowedRoles.length > 0) {
            setIsAuthorized(allowedRoles.includes(userRole));
          } else {
            setIsAuthorized(true);
          }
        } catch (e) {
          console.error("Error decoding token:", e);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }
      setLoading(false);
    };

    // For demonstration, wait 500ms before completing verification.
    const timer = setTimeout(verifyToken, 500);
    return () => clearTimeout(timer);
  }, [token, allowedRoles]);

  if (loading) {
    return <Spinner />;
  }
  if (!token || !isAuthorized) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
