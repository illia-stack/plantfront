import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../translations";

function Login() {
  
  const { login, authFetch, csrfToken } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loading) return;

    if (!csrfToken) {
      alert("App still initializing. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Use centralized fetch
      const res = await authFetch(`${API_BASE_URL}/login.php`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => {
        throw new Error("Invalid server response");
      });

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Login failed");
      }

      // ✅ Let AuthContext sync user
      await login();

      alert(t.loginSuccess || "Logged in!");
      navigate("/");

    } catch (err) {
      console.error(err);
      alert(err.message || t.loginFailed || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

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

          <button className="auth-btn" type="submit" disabled={loading || !csrfToken}>
            {loading ? "..." : t.loginButton}
          </button>

        </form>

        <div className="auth-switch">
          {language === "de" ? "Noch kein Konto?" : "No account?"}{" "}
          <span
            className="auth-link"
            onClick={() => navigate("/register")}
          >
            {t.registerButton}
          </span>
        </div>

      </div>
    </div>
  );
}

export default Login;