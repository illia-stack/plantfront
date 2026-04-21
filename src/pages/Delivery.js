import React, { useState, useContext } from "react";
import { API_BASE_URL } from "../config";
import { translations } from "../translations";
import { LanguageContext } from "../context/LanguageContext";

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

  const { language } = useContext(LanguageContext);
  const t = translations[language];

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

    try {
      const response = await fetch(`${API_BASE_URL}/create-checkout-session.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <h2>{t.deliveryTitle}</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder={t.name || "Name"}
          value={form.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="address"
          placeholder={t.address || "Address"}
          value={form.address}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="city"
          placeholder={t.city || "City"}
          value={form.city}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="postal"
          placeholder={t.postal || "Postal code"}
          value={form.postal}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="country"
          placeholder={t.country || "Country"}
          value={form.country}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="email"
          placeholder={t.email || "E-mail"}
          value={form.email}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="phone"
          placeholder={t.phone || "Phone"}
          value={form.phone}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">
          {t.deliverySubmit || "Save Delivery Details"}
        </button>
      </form>
    </div>
  );
}

export default Delivery;