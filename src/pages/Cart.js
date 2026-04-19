import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { translations } from "../translations";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL, BACKEND_URL } from "../config";

function Cart() {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    total
  } = useContext(CartContext);

  const handleCheckout = () => {
    navigate("/delivery");
  };

  const [products, setProducts] = useState([]);

 

  useEffect(() => {

    fetch(`${API_BASE_URL}/get-products.php?lang=${language}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Netzwerkantwort war nicht ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [language]);

  if (products.length === 0) {
    return (
      <div className="cart-container">
        <h1>{t.cartTitle}</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>{t.cartTitle}</h1>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <h2>{t.cartEmpty}</h2>
        </div>
      ) : (
        <>
          {cart.map((item) => {
            const product = products.find((p) => p.id === item.id);
            if (!product) return null;

            let imageSrc = product.image_url
              ? product.image_url.startsWith("http")
                ? product.image_url
                : `${BACKEND_URL}/uploads/${product.image_url}`
              : "https://via.placeholder.com/100";

            return (
              <div key={item.id} className="cart-card">
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="cart-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/100";
                  }}
                />

                <div className="cart-info">
                  <h3>{product.name}</h3>
                  <p>{Number(product.price).toFixed(2)} €</p>

                  <div className="cart-qty">
                    <button onClick={() => decreaseQty(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item.id)}>+</button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    {t.remove}
                  </button>
                </div>
              </div>
            );
          })}

          <div className="cart-total">
            <h2>
              {t.total}: {Number(total).toFixed(2)} €
            </h2>

            {/* 👇 ADD THIS */}
            {user && (
              <p style={{ color: "green", marginTop: "10px" }}>
                5% discount applied 🎉
              </p>
            )}

            <button className="primary-btn" onClick={handleCheckout}>
              {t.checkout}
            </button>
          </div>
          
        </>
      )}
    </div>
  );
}


export default Cart;