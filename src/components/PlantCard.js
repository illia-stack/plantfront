import React, { useContext, useCallback } from "react";
import { CartContext } from "../context/CartContext";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../translations";

function PlantCard({ plant }) {
  const { addToCart } = useContext(CartContext);
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  // stabiler Handler (verhindert unnötige Re-Renders)
  const handleAdd = useCallback(() => {
    addToCart(plant);
  }, [addToCart, plant]);

  return (
    <div className="card">

      <img
        src={process.env.PUBLIC_URL + "/product_images/" + plant.image_url}
        alt={plant.name}
        className="plant-image"
        loading="lazy"
      />

      <h3 className="plant-name">{plant.name}</h3>

      <p className="plant-price">
        €{Number(plant.price).toFixed(2)}
      </p>

      {/* Beschreibung jetzt via CSS Hover */}
      <p className="plant-description">
        {plant.description}
      </p>

      <button
        className="primary-btn"
        onClick={handleAdd}
      >
        {t.addToCart}
      </button>

    </div>
  );
}

export default React.memo(
  PlantCard,
  (prev, next) =>
    prev.plant.id === next.plant.id &&
    prev.plant.price === next.plant.price &&
    prev.plant.name === next.plant.name
);