import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ token, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
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
        { token ? (
          <>
            <Link to="/member" onClick={handleLinkClick}>Dashboard</Link>
            <button className="logout-btn" onClick={() => { onLogout(); handleLinkClick(); }}>
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
