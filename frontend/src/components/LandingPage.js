// src/components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div className="logo">Studio Web App</div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Studio Web App</h1>
          <p>Your complete solution for managing bookings, payments, and more.</p>
          <Link to="/login">
            <button className="cta-btn">Get Started</button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2>Our Features</h2>
        <div className="feature-container">
          <div className="feature-card">
            <h3>Easy Booking</h3>
            <p>Manage your appointments with ease using our intuitive interface.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Payments</h3>
            <p>Process payments securely with industry-leading technology.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Updates</h3>
            <p>Stay updated with real-time notifications and calendar integration.</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta">
        <h2>Ready to get started?</h2>
        <Link to="/login">
          <button className="cta-btn">Sign Up Today</button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <p>&copy; {new Date().getFullYear()} Studio Web App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
