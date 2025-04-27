import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add an item to the cart
  const addToCart = (product) => {
    setCart(prevCart => {
      // Check if the item is already in the cart
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        const updatedCart = [...prevCart];
        if (updatedCart[existingItemIndex].quantity < product.quantity) {
          updatedCart[existingItemIndex].quantity += 1;
        }
        return updatedCart;
      } else {
        // Item doesn't exist, add it with quantity 1
        return [...prevCart, { 
          ...product, 
          quantity: 1,
          maxQuantity: product.quantity // Store the max available quantity
        }];
      }
    });
  };

  // Remove an item from the cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Update the quantity of an item in the cart
  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // If quantity is 0 or less, remove the item
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          // Ensure we don't exceed the maximum available quantity
          const quantity = Math.min(newQuantity, item.maxQuantity);
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate the total number of items in the cart
  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate the total price of the cart
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const cartContextValue = {
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
}; 