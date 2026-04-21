import React, { useContext } from "react";
import { API_BASE_URL } from "../config";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../translations";

const Contact = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

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

      <form onSubmit={handleSubmit}
        action={`${API_BASE_URL}/send-contact.php`}
        method="POST"
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input type="text" name="name" placeholder={t.name || "Name"} required />
        <input type="email" name="email" placeholder={t.email || "Email"} required />
        <input type="text" name="subject" placeholder={t.subject || "Subject"} required />
        <textarea name="message" placeholder={t.message || "Message"} rows={5} required />
        <button type="submit" className="primary-btn">{t.send || "Send"}</button>
      </form>
    </div>
  );
};

export default Contact;