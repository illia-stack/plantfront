import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../translations";


function PlantCard({ plant }) {

  const [showDesc, setShowDesc] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  return (
    <div
      className="card"
      onMouseEnter={() => setShowDesc(true)}
      onMouseLeave={() => setShowDesc(false)}
    >

      <img
        src={process.env.PUBLIC_URL + "/product_images/" + plant.image_url}
        alt={plant.name}
        className="plant-image"
      />

      <h3 className="plant-name">{plant.name}</h3>

      <p className="plant-price">
        €{Number(plant.price).toFixed(2)}
      </p>

      {showDesc && (
        <p className="plant-description">
          {plant.description}
        </p>
      )}

      <button
        className="primary-btn"
        onClick={() => addToCart(plant)}
      >
        {t.addToCart}
      </button>





    </div>
  );
}



export default React.memo(
  PlantCard,
  (prevProps, nextProps) => prevProps.plant === nextProps.plant
);