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
    const handleScroll = () => {
      const scrollPosition = window.scrollY; // Aktuelle Scroll-Position
      console.log("Scroll Y:", scrollPosition); // Log für Debugging

      if (scrollPosition > 100) {  // Wenn die Seite mehr als 100px nach unten gescrollt wird
        setIsScrolled(true); // Scroll-Position überschreitet 100px
      } else {
        setIsScrolled(false); // Ansonsten zurück auf den ursprünglichen Zustand
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup des Event Listeners, wenn der Component unmountet
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