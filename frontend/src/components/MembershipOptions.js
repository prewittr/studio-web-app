import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import jwtDecode from "jwt-decode";
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useShoppingCart } from '../context/ShoppingCartContext';
import './MembershipOptions.css';

const stripePromise = loadStripe('pk_test_51NnRCARxXwnAJ8WElLYAnycNsXH91fy3oAk09I5FhoHpmKPlJNPCPjyz0n3s6SVWgRFkTgLa42bNGAdU3cPTAUXp00BNGq2lKF');

const MembershipOptions = ({ token }) => {
  const [selectedMembership, setSelectedMembership] = useState("infinite_heat");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { addItem } = useShoppingCart();

  // New state to manage package quantities.
  const [packageQuantities, setPackageQuantities] = useState({
    "sauna-8": 1,
    "sauna-4": 1,
    "red-light-4": 1
  });
  
  const handlePackageQuantityChange = (sessionPackage, e) => {
    const value = parseInt(e.target.value, 10);
    setPackageQuantities({
      ...packageQuantities,
      [sessionPackage]: isNaN(value) || value < 1 ? 1 : value,
    });
  };

  const handlePackageAddToCart = (sessionPackage) => {
    const quantity = packageQuantities[sessionPackage] || 1;
    addItem({
      priceId: getPackagePriceId(sessionPackage), // Add priceId field
      quantity: quantity,
      price: getPackagePrice(sessionPackage),
      type: "product", // Add type field
      name: getPackageName(sessionPackage),
      //... other metadata you might need
    });
    console.log("DEBUG:::Package Qauntity is:", quantity);
    setMessage("Package added to cart!");
  };

  const handleMembershipAddToCart = (membershipType) => {
    setSelectedMembership(membershipType);
    addItem({
      priceId: getMembershipPriceId(membershipType), // Add priceId field
      quantity: 1,
      price: getMembershipPrice(membershipType),
      type: "membership", // Add type field
      name: getMembershipName(membershipType),
      //... other metadata you might need
    });
    setMessage("Membership added to cart!");
  };

  const getMembershipName = (membershipType) => {
    switch (membershipType) {
      case "infinite_heat":
        return "Infinite Heat Membership";
      case "balanced_heat":
        return "Balanced Heat Membership";
      case "ember_heat":
        return "Ember Heat Membership";
      case "vip":
        return "VIP Mebership";
      case "redlight-unlimited":
        return "Radiant Glow Membership";
      default:
        return "Unknown Membership";
    }
  };

  const getMembershipPrice = (membershipType) => {
    switch (membershipType) {
      case "infinite_heat":
        return "$165.00";
      case "balanced_heat":
        return "$152.00";
        case "ember_heat":
          return "$100.00";
          case "vip":
            return "$260.00";
          case "redlight-unlimited":
            return "$75.00";
      default:
        return 0;
    }
  };

  // getMembershipPriceId function //TODO:Update with correct Stripe Price IDs
  const getMembershipPriceId = (membershipType) => {
    switch (membershipType) {
      case "infinite_heat":
        return "price_1Qv3tnRxXwnAJ8WE0zgQ2eeY"; // Replace with your actual price ID
      case "balanced_heat":
        return "price_1Qv3u1RxXwnAJ8WEAsxO7fpV"; // Replace with your actual price ID
      case "ember_heat":
        return "price_1Qv3uCRxXwnAJ8WEareO6gC1"; // Replace with your actual price ID
      case "radiant_glow":
        return "price_1NugUhRxXwnAJ8WEY3jXbpxq"; // Replace with your actual price ID
      case "vip":
        return "price_1NugUsRxXwnAJ8WEEd2pCD2vU"; // Replace with your actual price ID
      default:
        return null; // Or handle the invalid type appropriately
    }
  };

  const getPackageName = (sessionPackage) => { 
    switch (sessionPackage) {
      case "sauna-8":
        return "8 Session Sauna Package";
      case "sauna-4":
        return "4 Session Sauna Package";
      case "red-light-4":
        return "4 Session Red Light Package";
      default:
        return "Unknown Package";
    }
  };

  const getPackagePrice = (sessionPackage) => {
    switch (sessionPackage) {
      case "sauna-8":
        return "$250.00";
      case "sauna-4":
        return "$125.00";
      case "red-light-4":
        return "$100.00";
      default:
        return 0;
    }
  };

  // getPackagePriceId function //TODO:
  const getPackagePriceId = (membershipType) => {
    switch (membershipType) {
      case "sauna-8":
        return "price_1QvmWGRxXwnAJ8WEcxXDVlbV"; // Replace with your actual price ID
      case "sauna-4":
        return "price_1QvqctRxXwnAJ8WEs522bXOM"; // Replace with your actual price ID
      case "red-light-4":
        return "price_1QvqduRxXwnAJ8WEwH281dwD"; // Replace with your actual price ID
      default:
        return null; // Or handle the invalid type appropriately
    }
  };
  
  return (
    <div className="membership-options">
      <header className="membership-header">
        <h1>Membership Options</h1>
        <p>Choose the perfect membership to match your wellness goals!</p>
      </header>
      <div className="membership-cards">
        <div id="infinite-heat" className="membership-card">
          <h2>Infinite Heat Membership</h2>
          <p>Unlimited Infrared Sauna Sessions</p>
          <p>
            Enjoy complete freedom with unlimited access to our state-of-the-art infrared saunas.
          </p>
          <p>$165.00 per month</p>
          <button onClick={() => handleMembershipAddToCart("infinite_heat")}>
            Add to Cart
          </button>
        </div>
        <div id="balanced-heat" className="membership-card">
          <h2>Balanced Heat Membership</h2>
          <p>8 Infrared Sauna Sessions per month</p>
          <p>
            Experience the perfect balance of relaxation and renewal with eight sessions per month.
          </p>
          <p>$152.00 per month</p>
          <button onClick={() => handleMembershipAddToCart("balanced_heat")}>
            Add to Cart
          </button>
        </div>
        <div id="ember-heat" className="membership-card">
          <h2>Ember Heat Membership</h2>
          <p>4 Infrared Sauna Sessions per month</p>
          <p>
            Ideal for those seeking occasional relaxation and rejuvenation.
          </p>
          <p>$100.00 per month</p>
          <button onClick={() => handleMembershipAddToCart("ember_heat")}>
            Add to Cart
          </button>
        </div>
        <div id="radiant-glow" className="membership-card">
          <h2>Radiant Glow Membership</h2>
          <p>Unlimited Red Light Bed Sessions</p>
          <p>
            Revitalize your skin and body with unlimited access to our red light therapy beds.
          </p>
          <p>$75.00 per month</p>
          <button onClick={() => handleMembershipAddToCart("radiant_glow")}>
            Add to Cart
          </button>
        </div>
        <div id="vip" className="membership-card">
          <h2>V.I.P.</h2>
          <p>Unlimited Infrared and Red Light Bed Sessions</p>
          <p>
            For the ultimate wellness experience, enjoy unlimited access to both infrared and red light therapies.
          </p>
          <p>$260.00 per month</p>
          <button onClick={() => handleMembershipAddToCart("vip")}>
            Add to Cart
          </button>
        </div>
      </div>      
      <div className="package-cards">
        <header className="package-header">
          <h1>Package Options</h1>
          <p>Choose the right package that works for you!</p>
        </header>
        <div id="sauna-8" className="package-card">
          <h2>8 Session Sauna Package</h2>
          <p>8 Infrared Sauna Sessions</p>
          <p>
            Enjoy 8 sessions in our state-of-the-art infrared saunas (Sessions expire in 12 months).
          </p>
          <p>$220.00 per month</p>
          <div>
            <label htmlFor="sauna-8-qty">Quantity: </label>
            <input
              id="sauna-8-qty"
              type="number"
              min="1"
              value={packageQuantities["sauna-8"]}
              onChange={(e) => handlePackageQuantityChange("sauna-8", e)}
            />
          </div>
          <button onClick={() => handlePackageAddToCart("sauna-8")}>
            Add to Cart
          </button>
        </div>
        <div id="sauna-4" className="package-card">
          <h2>4 Session Sauna Package</h2>
          <p>4 Infrared Sauna Sessions</p>
          <p>
            Enjoy 4 sessions in our state-of-the-art infrared saunas (Sessions expire in 12 months).
          </p>
          <p>$120.00 per month</p>
          <div>
            <label htmlFor="sauna-4-qty">Quantity: </label>
            <input
              id="sauna-4-qty"
              type="number"
              min="1"
              value={packageQuantities["sauna-4"]}
              onChange={(e) => handlePackageQuantityChange("sauna-4", e)}
            />
          </div>
          <button onClick={() => handlePackageAddToCart("sauna-4")}>
            Add to Cart
          </button>
        </div>
        <div id="red-light-4" className="package-card">
          <h2>4 Session Red Light Package</h2>
          <p>4 Red Light Bed Sessions</p>
          <p>
            Enjoy 4 sessions in our state-of-the-art red light beds (Sessions expire in 12 months).
          </p>
          <p>$80.00 per month</p>
          <div>
            <label htmlFor="red-light-4-qty">Quantity: </label>
            <input
              id="red-light-4-qty"
              type="number"
              min="1"
              value={packageQuantities["red-light-4"]}
              onChange={(e) => handlePackageQuantityChange("red-light-4", e)}
            />
          </div>
          <button onClick={() => handlePackageAddToCart("red-light-4")}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipOptions;
