import React, { useState } from "react";
import { API_BASE_URL } from "../config";

function Delivery() {

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postal: "",
    country: "",
    email: "",
    phone: ""
  });

const user = JSON.parse(localStorage.getItem("user")) || null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const rawCart = JSON.parse(localStorage.getItem("cart")) || [];

  const preparedCart = rawCart.map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }));




  const language = localStorage.getItem("language") || "en";

  try {
  const response = await fetch(`${API_BASE_URL}/create-checkout-session.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cart: preparedCart,
      delivery: form,
      user: user,
      language: language
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
    <div style={{ padding: "40px" }}>
      <h2>Delivery Details</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="postal"
          placeholder="Postal Code"
          value={form.postal}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <br /><br />

        <button type="submit">
          Save Delivery Details
        </button>

      </form>
    </div>
  );
}

export default Delivery;