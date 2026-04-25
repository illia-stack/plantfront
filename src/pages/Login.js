import { useState, useContext } from "react";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../translations";

function Login() {
  const { login } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const text = await res.text();

      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Login failed");
      }

      login(data.user);
      alert(t.loginSuccess || "Logged in!");

    } catch (err) {
      console.error(err);
      alert(err.message || t.loginFailed || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2>{t.loginTitle}</h2>

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >

          <input
            type="email"
            placeholder={t.loginEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder={t.loginPassword}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "..." : t.loginButton}
          </button>

        </form>

        <div className="auth-switch">
          {language === "de" ? "Noch kein Konto?" : "No account?"}{" "}
          <span className="auth-link" onClick={() => window.location.href = "/register"}>
            {t.registerButton}
          </span>
        </div>

      </div>
    </div>
  );
}

export default Login;