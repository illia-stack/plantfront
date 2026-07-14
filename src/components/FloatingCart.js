import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";


function FloatingCart() {
  const { cart, total } = useContext(CartContext);
  const navigate = useNavigate();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll-Handler für das Tracking der Scroll-Position
  useEffect(() => {
    let timeout = null;

    const handleScroll = () => {
      if (timeout) return;

      timeout = setTimeout(() => {
        setIsScrolled(window.scrollY > 100);
        timeout = null;
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); 

  // Wenn der Warenkorb leer ist, zeigen wir nichts
  if (cartCount === 0) return null;

  return (
    <div
      className={`floating-cart ${isScrolled ? "scrolled" : ""}`}
      onClick={() => navigate("/cart")}
    >
      🛒 {cartCount} | {(Number(total) || 0).toFixed(2)} €
    </div>
  );
}

export default FloatingCart;