import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  // Save cart in the browser whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const found = cart.find((i) => i._id === product._id);
    if (found) {
      if (found.qty >= product.stock) return;
      setCart(cart.map((i) => (i._id === product._id ? { ...i, qty: i.qty + 1 } : i)));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const changeQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(cart.map((i) => (i._id === id ? { ...i, qty: Math.min(qty, i.stock) } : i)));
  };

  const removeFromCart = (id) => setCart(cart.filter((i) => i._id !== id));
  const clearCart = () => setCart([]);

  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, changeQty, removeFromCart, clearCart, count, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
