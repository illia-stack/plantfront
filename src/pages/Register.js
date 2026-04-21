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
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        alert(t.registerSuccess || "Registration successful!");
        login(data.user); // optional: auto-login
        navigate("/"); // go to home after registration
      } else {
        alert(data.message || t.registerFailed || "Registration failed!");
      }
    } catch (err) {
      console.error(err);
      alert(t.registerFailed || "Registration failed!");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>{t.registerTitle}</h2>

      <form onSubmit={(e) => { 
        e.preventDefault(); 
        handleRegister(); 
      }}>
        <input
          type="text"
          placeholder={t.registerName || "Name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="email"
          placeholder={t.registerEmail || "Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder={t.registerPassword || "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">{t.registerButton || "Register"}</button>
      </form>
    </div>
  );
}

export default Register;