import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartUpdated, setCartUpdated] = useState(false);

  const triggerCartBounce = useCallback(() => {
    setCartUpdated(true);
    setTimeout(() => setCartUpdated(false), 600);
  }, []);

  const incrementCart = useCallback((amount = 1) => {
    setCartCount(prev => prev + amount);
    triggerCartBounce();
  }, [triggerCartBounce]);

  const decrementCart = useCallback((amount = 1) => {
    setCartCount(prev => Math.max(0, prev - amount));
  }, []);

  const setCount = useCallback((count) => {
    setCartCount(count);
  }, []);

  const resetCart = useCallback(() => {
    setCartCount(0);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCount, incrementCart, decrementCart, resetCart, cartUpdated }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
