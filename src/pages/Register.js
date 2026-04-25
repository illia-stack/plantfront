import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../translations";

function Register() {
  const { login } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await res.text();

      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Registration failed");
      }

      alert(t.registerSuccess || "Registration successful!");

      login(data.user);
      navigate("/");

    } catch (err) {
      console.error(err);
      alert(err.message || t.registerFailed || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2>{t.registerTitle}</h2>

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >

          <input
            type="text"
            placeholder={t.registerName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder={t.registerEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder={t.registerPassword}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "..." : t.registerButton}
          </button>

        </form>

        <div className="auth-switch">
          {language === "de" ? "Schon ein Konto?" : "Already have an account?"}{" "}
          <span className="auth-link" onClick={() => window.location.href = "/login"}>
            {t.loginButton}
          </span>
        </div>

      </div>
    </div>
  );
}

export default Register;