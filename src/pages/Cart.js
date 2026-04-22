import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { translations } from "../translations";

function Cart() {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const navigate = useNavigate();

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

  return (
    <div className="cart-container">
      <h1>{t.cart}</h1>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <h2>{t.cartEmpty}</h2>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-card">
              <div className="cart-info">
                <h3>{item.name}</h3>

                <p>
                  {Number(item.price).toFixed(2)} € × {item.quantity}
                </p>

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
          ))}

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