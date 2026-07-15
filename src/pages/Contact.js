import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

function Contact() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE_URL}/send-contact.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid JSON response");
      }

      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }

    } catch {
      setStatus("error");
    }

    setLoading(false);

  };

  return (
    <div className="contact-page">

      <div className="contact-card">

        <h1 className="contact-title">Contact Us</h1>

        <form onSubmit={handleSubmit} className="contact-form">

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
          />


          <textarea
            name="message"
            placeholder="Type your message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            required
          />




          <button type="submit" disabled={loading}>
            Send
          </button>

        </form>

        {status === "success" && (
          <p className="success-text">Message sent successfully!</p>
        )}

        {status === "error" && (
          <p className="error-text">Failed to send message. Please try again.</p>
        )}

      </div>

    </div>
  );
}

export default Contact;