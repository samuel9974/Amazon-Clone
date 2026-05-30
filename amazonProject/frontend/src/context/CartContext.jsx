import React, { createContext,useCallback,useContext,useEffect,useMemo,useState } from "react";
import { addToCart, getCart, getCartItemCount, removeCartItem, updateCartItem } from "../Api/cartApi.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

const emptyCart = { items: [], total: 0 };

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

export function CartProvider({ children }) {
  // Auth context to check if user is authenticated
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refresh cart to get the latest cart data
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(emptyCart);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError(err.message || "Failed to load cart");
      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      refreshCart();
    }
  }, [isAuthenticated, authLoading, refreshCart]);

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      const data = await addToCart({ productId, quantity });
      setCart(data);
      setError(null);
      return data;
    },
    [],
  );

  const updateQuantity = useCallback(async (productId, quantity) => {
    const data = await updateCartItem(productId, { quantity });
    setCart(data);
    setError(null);
    return data;
  }, []);

  const removeItem = useCallback(async (productId) => {
    const data = await removeCartItem(productId);
    setCart(data);
    setError(null);
    return data;
  }, []);

  const changeQuantity = useCallback(
    async (productId, currentQty, delta) => {
      const nextQty = currentQty + delta;
      if (nextQty < 1) {
        return removeItem(productId);
      }
      return updateQuantity(productId, nextQty);
    },
    [removeItem, updateQuantity],
  );

  const itemCount = useMemo(() => getCartItemCount(cart), [cart]);

  const value = useMemo(() => ({ cart, itemCount, loading, error, refreshCart, addItem, updateQuantity, removeItem, changeQuantity }),
    [cart, itemCount, loading, error, refreshCart, addItem, updateQuantity, removeItem, changeQuantity],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
