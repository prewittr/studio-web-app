//import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";
//import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "./AuthContext";
import "./CartPage.css";

const stripePromise = loadStripe(
  "pk_test_51NnRCARxXwnAJ8WElLYAnycNsXH91fy3oAk09I5FhoHpmKPlJNPCPjyz0n3s6SVWgRFkTgLa42bNGAdU3cPTAUXp00BNGq2lKF"
);

const CartPage = () => {
  const { token } = useAuth();
  const { cartItems, updateItemQuantity, removeItem } = useShoppingCart();
  const navigate = useNavigate();
  // State to ensure we only trigger checkout once after token is available
  //const [checkoutInitiated, setCheckoutInitiated] = useState(false);
  
  const handleQuantityChange = (itemId, newQuantity) => {
    // Enforce a minimum quantity of 1.
    const quantity = newQuantity < 1 ? 1 : newQuantity;
    updateItemQuantity(itemId, quantity);
  };

  console.log("DEBUG: token from AuthContext in CartPage:", token);

  const handleStripeCheckout = async (event) => {
    event.preventDefault(); // Prevent default Link behavior    
    if (!token) { // Check if the user is logged in      
      navigate("/login", { state: { from: "/cart" } }); // Redirect to login if not logged in
      return;
    }
    try {
      const stripe = await stripePromise;
      const response = await axios.post(
        "http://localhost:5000/api/stripe/create-checkout-session",
        {
          cartItems: cartItems, // sending cartItems from context
        },       
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },          
        }        
      );console.log("DEBUG::CartPage response:", response); 
      console.log("DEBUG::CartPage Cart Items:", cartItems);

      const { sessionId } = response.data;
      console.log("DEBUG::CartPage sessionID:", sessionId); 
      stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error during checkout:", error);
      // Handle the error appropriately (e.g., display an error message)
    }
  };
  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h2>{item.name}</h2>
                <p>Price: {item.price}</p>
              </div>
              <div className="item-quantity">
                <label htmlFor={`qty-${item.id}`}>Quantity: </label>
                <input
                  id={`qty-${item.id}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value, 10))
                  }
                />
              </div>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}
          <button className="checkout-button" onClick={handleStripeCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;