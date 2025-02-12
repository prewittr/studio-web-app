import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ token, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // When logout is triggered, call the onLogout callback and navigate to the landing page ("/")
  const handleLogout = () => {
    onLogout(); // This should remove the token and reset auth state in your parent component
    navigate("/"); // Redirect to the landing page
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/" onClick={handleLinkClick}>Diviti Adora Studios</Link>
      </div>
      <div className={`navbar__links ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={handleLinkClick}>Home</Link>
        <Link to="/features" onClick={handleLinkClick}>Features</Link>
        <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
        {token ? (
          <>
            <Link to="/member" onClick={handleLinkClick}>Dashboard</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={handleLinkClick}>Login</Link>
            <Link to="/register" onClick={handleLinkClick}>Register</Link>
          </>
        )}
      </div>
      <div className="navbar__toggle" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default NavBar;
