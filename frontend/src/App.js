import { useAuth } from './components/AuthContext'; // Import useAuth
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import { ShoppingCartProvider } from './context/ShoppingCartContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import MemberProfile from './components/MemberProfile';
import Contact from './components/Contact';
import Bookings from './components/Bookings';
import Payment from './components/Payment';
import Checkout from './components/Checkout';
import Features from './components/Features';
import InfraredSaunaInfo from './components/InfraredSaunaInfo';
import ChromotherapyInfo from './components/ChromotherapyInfo';
import HalotherapyInfo from './components/HalotherapyInfo';
import RedLightTherapyInfo from './components/RedLightTherapyInfo';
import MembershipOptions from './components/MembershipOptions';
import MemberLanding from './components/MemberLanding';
//import MemberCheckIn from './components/MemberCheckIn';
import CartPage from './components/CartPage';
import BookSession from './components/BookSession';
import StaffDashboard from './components/StaffDashboard';
import StaffEditBooking from './components/StaffEditBooking';
import SuiteAssignmentPage from './components/SuiteAssignmentPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Success from './components/Success';
import Cancel from './components/Cancel';

function App() {
  // Use a consistent key "jwtToken" when accessing localStorage.
  const { token, initialized, login, logout } = useAuth(); // Get initialized from AuthContext
  //const [token, setToken] = useState(localStorage.getItem("jwtToken") || "");
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch the user profile if a token is available.
  useEffect(() => {
    console.log("DEBUG::::useEffect running, token:", token);
    if (token) {
      axios
        .get("${process.env.REACT_APP_API_BASE_URL}/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserProfile(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        });
    } else {
      setUserProfile(null);
    }
  }, [token]);

  const handleLogin = (token) => {
    console.log("DEBUG::::handleLogin:::, token:", token);
    login({ username: 'user' }, token); // Use login from useAuth
    // setToken(token);
    // Use the same key "jwtToken" for storing the token.
    localStorage.setItem("jwtToken", token);

    console.log("DEBUG::Location state from:", location.state?.from);

    if (location.state?.from === "/cart") {
      navigate("/cart");
    } else {
      navigate("/member");
    }
  };

  const handleLogout = () => {
    logout(); // Use logout from useAuth
    // setToken("");
    localStorage.removeItem("jwtToken");
    setUserProfile(null);
  };

  console.log('DEBUG::Token in App.js:', token);

  return (
    // Pass token and setToken into ShoppingCartProvider for shared state.
    <ShoppingCartProvider token={token} >
      <NavBar onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage token={token} />} />
        <Route
          path="/login"
          element={
            <PublicRoute token={token} initialized={initialized}> 
        <Login onLogin={handleLogin} />
      </PublicRoute>

          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute token={token} initialized={initialized}> 
        <Register />
      </PublicRoute>

          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/features" element={<Features />} />
        <Route path="/profile" element={<MemberProfile />} />
        <Route path="/infrared-info" element={<InfraredSaunaInfo />} />
        <Route path="/chromotherapy-info" element={<ChromotherapyInfo />} />
        <Route path="/halotherapy-info" element={<HalotherapyInfo />} />
        <Route path="/redlight-info" element={<RedLightTherapyInfo />} />
        <Route path="/staff/edit-booking/:id" element={<StaffEditBooking />} />
        <Route path="/memberships" element={<MembershipOptions token={token} />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        
        {/* Protected routes */}
        <Route
          path="/member"
          element={
            <ProtectedRoute token={token}>
              {userProfile && userProfile.role === 'member' ? (
                <MemberLanding />
              ) : userProfile && (userProfile.role === 'staff' || userProfile.role === 'admin') ? (
                <Navigate to="/staff" />
              ) : (
                <p>Loading...</p>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-session"
          element={
            <ProtectedRoute token={token}>
              <BookSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute token={token}>
              {userProfile && (userProfile.role === 'staff' || userProfile.role === 'admin') ? (
                <StaffDashboard />
              ) : userProfile && userProfile.role === 'member' ? (
                <Navigate to="/member" />
              ) : (
                <p>Loading...</p>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/suite-assignments"
          element={
            <ProtectedRoute token={token}>
              <SuiteAssignmentPage />
            </ProtectedRoute>
          }
        />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ShoppingCartProvider>
  );
}

export default App;
