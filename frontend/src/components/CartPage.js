import React from 'react';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { Link, useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, clearCart } = useShoppingCart();
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);

  const handleCheckout = async () => {
    // Here you would integrate your payment gateway.
    // For now, we'll simulate a successful checkout.
    alert(`Purchase complete! Total: $${(totalAmount / 100).toFixed(2)}`);
    clearCart();
    navigate('/member');
  };

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Continue shopping</Link>
        </p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <p>Price: ${(item.price / 100).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <h3>Total: ${(totalAmount / 100).toFixed(2)}</h3>
          <div className="cart-actions">
            <button onClick={handleCheckout}>Complete Purchase</button>
            <Link to="/">Continue Shopping</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
