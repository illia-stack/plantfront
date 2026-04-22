import React, { useState, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../translations";
import { API_BASE_URL } from "../config";

function Contact() {
  const { language } = useContext(LanguageContext);
  const t = translations[language].contact;

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

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

        <h1 className="contact-title">{t.contact}</h1>

        <form onSubmit={handleSubmit} className="contact-form">

          <input
            type="text"
            name="name"
            placeholder={t.name}
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder={t.email}
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="subject"
            placeholder={t.subject}
            value={form.subject}
            onChange={handleChange}
          />

          <textarea
            name="message"
            placeholder={t.message}
            value={form.message}
            onChange={handleChange}
            rows="5"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "..." : t.send}
          </button>

        </form>

        {status === "success" && (
          <p className="success-text">{t.sendSuccess}</p>
        )}

        {status === "error" && (
          <p className="error-text">{t.sendError}</p>
        )}

      </div>

    </div>
  );
}

export default Contact;