import React, { useState, useContext } from "react";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Delivery() {

  const { user, authFetch } = useContext(AuthContext);  

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postal: "",
    country: "",
    email: "",
    phone: ""
  });

  
  const { cart } = useContext(CartContext);
  
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const preparedCart = cart.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    
    try {
        const response = await authFetch(`${API_BASE_URL}/create-checkout-session.php`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart: preparedCart,
            delivery: form,
          })
        });

        if (!response.ok) {
          const text = await response.text();
          console.error("Server error:", text);
          alert("Server error");
          return;
        }

        const data = await response.json();
        console.log("Stripe response:", data);

        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("Stripe session error:", data);
          alert("Something went wrong. Please try again.");
        }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

      return (
        <div className="delivery-container">
          <h2>Delivery Details</h2>

          <form onSubmit={handleSubmit} className="delivery-form">

            <input
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="address"
              placeholder="Address of delivery"
              value={form.address}
              onChange={handleChange}
              required
            />

            <input
              name="city"
              placeholder="City of delivery"
              value={form.city}
              onChange={handleChange}
              required
            />

            <input
              name="postal"
              placeholder="Postal code"
              value={form.postal}
              onChange={handleChange}
              required
            />

            <input
              name="country"
              placeholder="Country of delivery"
              value={form.country}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Your e-mail"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Your Phone"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <button type="submit" className="primary-btn">
              Save Delivery Details
            </button>

          </form>
        </div>
      );
}

export default Delivery;