import { createContext, useState, useEffect, useMemo, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();
export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");

    try{
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
    
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save cart", err);
    }
  }, [cart]);

  // ---------------------------
  // CART FUNCTIONS
  // ---------------------------

  const addToCart = (plant) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === plant.id);

      if (existing) {
        return prev.map((item) =>
          item.id === plant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: plant.id,
          name: plant.name,
          price: plant.price,
          quantity: 1
        }
      ];
    });
  };

  const increaseQty = (id) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

  const decreaseQty = (id) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => setCart([]);



  // ---------------------------
  // TOTAL (WITH DISCOUNT)
  // ---------------------------

 const { user } = useContext(AuthContext);

  const total = useMemo(() => {
    const raw = cart.reduce((sum, item) =>
      sum + (Number(item.price) || 0) * (item.quantity || 0)
    , 0);

    return user ? Math.round(raw * 0.95 * 100) / 100 : raw;
  }, [cart, user]);
 

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};