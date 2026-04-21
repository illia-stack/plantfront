import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { translations } from "../translations";

import { API_BASE_URL } from "../config";

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



  return (
    <div className="cart-container">
      <h1>{t.cart}</h1>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <h2>{t.cartEmpty}</h2>
        </div>
      ) : (
        <>
          {cart.map((item) => {
            const product = products.find((p) => p.id === item.id);

            const name = product?.name || item.name;
            const price = product?.price || item.price;

           

            return (
              <div key={item.id} className="cart-card">

                <div className="cart-info">
                  <h3>{name}</h3>
                  <p>{Number(price).toFixed(2)} € × {item.quantity}</p>

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