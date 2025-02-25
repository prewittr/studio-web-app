import React, { createContext, useState, useContext, useEffect } from 'react';

const ShoppingCartContext = createContext();

export const useShoppingCart = () => {
  return useContext(ShoppingCartContext);
};

export const ShoppingCartProvider = ({ children, token }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    setCartItemCount(cartItems.length);
  }, [cartItems]);

  const addItem = (item) => {
    // Ensure the added item conforms to the structure
    if (item.priceId && item.type) {
      // Generate a unique id if not provided
      if (!item.id) {
        item.id = Date.now() + Math.random();
      }
      setCartItems([...cartItems, item]);
    } else {
      console.error("Invalid item format:", item);
    }
  };

  const removeItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  };

  /*const clearCart = () => {
    setCartItems([]);
  };*/

  const updateItemCount = (newCount) => {
    setCartItemCount(newCount);
  };

  // New function: updateItemQuantity
  const updateItemQuantity = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const value = {
    cartItems,
    addItem,
    removeItem,
    updateItemQuantity,
    cartItemCount,
    token,    // shared token from App.js
    updateItemCount,
  };

  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
    </ShoppingCartContext.Provider>
  );
};
