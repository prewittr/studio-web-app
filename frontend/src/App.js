import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import MemberProfile from './components/MemberProfile';
import Contact from './components/Contact';
import Bookings from './components/Bookings';
import Payment from './components/Payment';
import Features from './components/Features';
import InfraredSaunaInfo from './components/InfraredSaunaInfo';
import ChromotherapyInfo from './components/ChromotherapyInfo';
import HalotherapyInfo from './components/HalotherapyInfo';
import RedLightTherapyInfo from './components/RedLightTherapyInfo';
import MembershipOptions from './components/MembershipOptions';
import MemberLanding from './components/MemberLanding';
import BookSession from './components/BookSession';
import StaffDashboard from './components/StaffDashboard';
import SuiteAssignmentPage from './components/SuiteAssignmentPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';


function App() {
  const [token, setToken] = useState(localStorage.getItem('jwtToken') || '');
  const [userProfile, setUserProfile] = useState(null);

  // Fetch the user profile if a token is available
  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserProfile(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
          setUserProfile(null);
        });
    } else {
      setUserProfile(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setToken('');
    setUserProfile(null);
  };

  return (
    <Router>
      <NavBar token={token} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage token={token} />} />
        <Route
          path="/login"
          element={
            <PublicRoute token={token}>
              <Login onLogin={(t) => setToken(t)} />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute token={token}>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/features" element={<Features />} />
        <Route path="/profile" element={<MemberProfile />} />
        <Route path="/infrared-info" element={<InfraredSaunaInfo />} />
        <Route path="/chromotherapy-info" element={<ChromotherapyInfo />} />
        <Route path="/halotherapy-info" element={<HalotherapyInfo />} />
        <Route path="/redlight-info" element={<RedLightTherapyInfo />} />
        <Route path="/memberships" element={<MembershipOptions />} />
        
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
    </Router>
  );
}

export default App;
