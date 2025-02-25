import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './Checkout.css';

const stripePromise = loadStripe('pk_test_51NnRCARxXwnAJ8WElLYAnycNsXH91fy3oAk09I5FhoHpmKPlJNPCPjyz0n3s6SVWgRFkTgLa42bNGAdU3cPTAUXp00BNGq2lKF', {
    betas: ['custom_checkout_beta_5'],});

const Checkout = () => {
  const handleClick = async () => {
    console.log("Button clicked!");
    const stripe = await stripePromise;
    console.log("Stripe loaded:", stripe);
    try {
      console.log("Fetching checkout session...");
      const response = await fetch('${process.env.REACT_APP_API_BASE_URL}/stripe/create-checkout-session', {
        method: 'POST',
      });
      console.log("Response:", response);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", response.status, errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { id } = await response.json();
      console.log("Session ID:", id);
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) {
        console.error('Stripe Redirect Error:', error);
      }
    } catch (error) {
      console.error('Fetch or Stripe Error:', error);
    }
  };

  console.log("DEBUG: Checkout component mounted");

  return (
    <div className="checkout-container">
      <button className="checkout-button" onClick={handleClick}>Buy Now</button>
    </div>
  );
};

export default Checkout;
