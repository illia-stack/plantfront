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

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        login(data.user);
        alert(t.loginSuccess || "Logged in!");
      } else {
        alert(t.loginFailed);
      }
    } catch (err) {
      console.error(err);
      alert(t.loginFailed);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>{t.loginTitle}</h2>
      <input
        placeholder={t.loginEmail}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder={t.loginPassword}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>{t.loginButton}</button>
    </div>
  );
}

export default Login;