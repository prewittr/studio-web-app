import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShoppingCart } from "../context/ShoppingCartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import axios for API calls
import { loadStripe } from "@stripe/stripe-js"; // Import Stripe.js
import { useAuth } from "./AuthContext"; // Import useAuth for token
import './NavBar.css';

const stripePromise = loadStripe(
  "pk_test_51NnRCARxXwnAJ8WElLYAnycNsXH91fy3oAk09I5FhoHpmKPlJNPCPjyz0n3s6SVWgRFkTgLa42bNGAdU3cPTAUXp00BNGq2lKF"
);


const NavBar = React.memo(({ onLogout }) => {
  const { cartItemCount } = useShoppingCart();
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuth(); // Access the token from AuthContext
  const navigate = useNavigate();
  const { cartItems } = useShoppingCart();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };
  

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/" onClick={handleLinkClick}>
          Diviti Adora Infrared and Red Light Studio
        </Link>
      </div>
      <div className={`navbar__links ${isOpen? 'open': ''}`}>
        <Link to="/" onClick={handleLinkClick}>Home</Link>
        <Link to="/memberships" onClick={handleLinkClick}>Services</Link>
        <Link to="/contact" onClick={handleLinkClick}>Contact</Link>

        {/* Conditionally render the cart link based on cartItemCount */}
        {cartItemCount > 0 && (
          <Link to="/cart" >
          <div className="cart-icon">
            <FontAwesomeIcon icon={faShoppingCart} />
            <span className="cart-count">{cartItemCount}</span>
          </div>
        </Link>
        )}

        {token? (
          <>
            <Link to="/member" onClick={handleLinkClick}>Dashboard</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ): (
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
});

export default NavBar;