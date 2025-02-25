import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initialized, setInitialized] = useState(false); // renamed flag

// On component mount, check for token in localStorage and verify its validity.
useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;
        // Only check expiration if an 'exp' field exists.
        if (decoded.exp && decoded.exp < currentTime) {
          // Token expired – remove it.
          localStorage.removeItem('jwtToken');
          setToken(null);
          setUser(null);
        } else {
          setToken(storedToken);
          // Set the user using the decoded token data.
          setUser(decoded);
        }
      } catch (error) {
        // If token cannot be decoded, remove it.
        localStorage.removeItem('jwtToken');
        setToken(null);
        setUser(null);
      }
    }
    console.log("AuthContext initialized:", initialized, "user:", user, "token:", token);
    // Mark initialization complete, regardless of whether a token was found.
    setInitialized(true);
  }, [initialized, token, user]);

  
  // Function to update the user and token in state
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    // Store token under 'jwtToken'
    localStorage.setItem('jwtToken', tokenData);
    console.log("Login successful. user:", userData, "token:", tokenData);
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jwtToken');
  };

  
  return (
    <AuthContext.Provider value={{ user, token, login, logout, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth };
