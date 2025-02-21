import React from 'react';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { useNavigate } from 'react-router-dom';
import './MembershipOptions.css';

const MembershipOptions = ({ token }) => {
  const { addItem } = useShoppingCart();
  const navigate = useNavigate();

  const membershipOptions = [
    {
      id: 'infinite_heat',
      title: 'Infinite Heat Membership',
      description: 'Unlimited Infrared Sauna Sessions. Enjoy complete freedom with unlimited access to our state-of-the-art infrared saunas.',
      price: 5000 // Price in cents
    },
    {
      id: 'balanced_heat',
      title: 'Balanced Heat Membership',
      description: '8 Infrared Sauna Sessions per month. Experience the perfect balance of relaxation and renewal with eight sessions per month.',
      price: 3000
    },
    {
      id: 'ember_heat',
      title: 'Ember Heat Membership',
      description: '4 Infrared Sauna Sessions per month. Ideal for those seeking occasional relaxation and rejuvenation.',
      price: 2000
    },
    {
      id: 'radiant_glow',
      title: 'Radiant Glow Membership',
      description: 'Unlimited Red Light Bed Sessions. Revitalize your skin and body with unlimited access to our red light therapy beds.',
      price: 4000
    },
    {
      id: 'vip',
      title: 'V.I.P.',
      description: 'Unlimited Infrared and Red Light Bed Sessions. For the ultimate wellness experience, enjoy unlimited access to both therapies.',
      price: 8000
    }
  ];

  const handleAddToCart = (membership) => {
    if (!token) {
      // If user is not logged in, redirect to login with a redirect query.
      alert('Please sign in or register to add items to your cart.');
      navigate('/login?redirect=/cart');
      return;
    }
    // Add the selected membership to the shopping cart
    addItem({
      id: membership.id,
      type: 'membership',
      title: membership.title,
      description: membership.description,
      price: membership.price
    });
    alert(`${membership.title} added to cart!`);
    // Redirect to the cart page (route "/cart")
    navigate('/cart');
  };

  return (
    <div className="membership-options">
      <header className="membership-header">
        <h1>Membership Options</h1>
        <p>Choose the perfect membership to match your wellness goals.</p>
      </header>
      <div className="membership-cards">
        {membershipOptions.map((membership) => (
          <div key={membership.id} id={membership.id} className="membership-card">
            <h2>{membership.title}</h2>
            <p>{membership.description}</p>
            <p>Price: ${(membership.price / 100).toFixed(2)}</p>
            <button onClick={() => handleAddToCart(membership)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipOptions;
