import React, { useContext } from "react";
import { API_BASE_URL } from "../config";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../translations";

const Contact = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language].contact; // ✅ direkt das Kontakt-Objekt

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const res = await fetch(`${API_BASE_URL}/send-contact.php`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert(t.sendSuccess);
        e.target.reset();
      } else {
        alert(t.sendError);
      }
    } catch (err) {
      console.error(err);
      alert(t.sendError);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      <h2>{t.contact}</h2>
<form onSubmit={handleSubmit}>
  <input type="text" name="name" placeholder={t.name} required />
  <input type="email" name="email" placeholder={t.email} required />
  <input type="text" name="subject" placeholder={t.subject} required />
  <textarea name="message" placeholder={t.message} rows={5} required />
  <button type="submit" className="primary-btn">{t.send}</button>
</form>
    </div>
  );
};

export default Contact;