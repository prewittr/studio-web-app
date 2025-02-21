import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './MembershipOptions.css';

const stripePromise = loadStripe('pk_test_51NnRCARxXwnAJ8WElLYAnycNsXH91fy3oAk09I5FhoHpmKPlJNPCPjyz0n3s6SVWgRFkTgLa42bNGAdU3cPTAUXp00BNGq2lKF');

const MembershipOptions = ({ token }) => {
    useEffect(() => {
        console.log('stripe-pricing-table defined:', !!window.customElements.get('stripe-pricing-table'));
      }, []);
  const navigate = useNavigate();

  const handleCheckout = async (priceId) => {
    if (!token) {
      alert('Please sign in or register to purchase a membership.');
      navigate('/login?redirect=/memberships');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", response.status, errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { id } = await response.json();
      console.log("Session ID:", id);
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) {
        console.error('Stripe Redirect Error:', error);
      }
    } catch (error) {
      console.error('Error during Stripe checkout:', error);
    }
  };

  return (
    <div className="membership-options">
      {/* Directly render the custom element */}
      <stripe-pricing-table
        pricing-table-id="prctbl_1Qv3wYRxXwnAJ8WE0ITHakAF"
        publishable-key="pk_test_51NnRCARxXwnAJ8WElLYAnycNsXH91fy3oAk09I5FhoHpmKPlJNPCPjyz0n3s6SVWgRFkTgLa42bNGAdU3cPTAUXp00BNGq2lKF"
        on-subscription-create={(event) => {
          const priceId = event.detail.subscription.price;
          handleCheckout(priceId);
          
        }}
      />
    </div>
  );
};

export default MembershipOptions;
