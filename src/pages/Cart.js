import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Cart() {
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    total
  } = useContext(CartContext);

  let finalTotal = total;
  if (user && user.id) {
    finalTotal = total * 0.95;
  }


  const handleCheckout = () => {
    navigate("/delivery");
  };

  const [products, setProducts] = useState([]);

 

  useEffect(() => {

    fetch(`${API_BASE_URL}/get-products.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);


  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <h2>Cart is empty</h2>
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
                  <h3 className="cart-name">{name}</h3>
                  <p className="cart-price">{Number(price).toFixed(2)} € × {item.quantity}</p>

                  <div className="cart-qty">
                    <button className="qty-btn" onClick={() => decreaseQty(item.id)}>-</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => increaseQty(item.id)}>+</button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div className="cart-total">
            <h2>
              Total price: {Number(finalTotal).toFixed(2)} €
            </h2>

            {user && (
              <p style={{ color: "green" }}>
                ✅ 5% discount applied
              </p>
            )}
           

            <button className="primary-btn" onClick={handleCheckout}>
              Proceed to Payment
            </button>
          </div>
          
        </>
      )}
    </div>
  );
}


export default Cart;