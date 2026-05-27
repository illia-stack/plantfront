import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { translations } from "../translations";


function Navbar() {
  const { language, changeLanguage } = useContext(LanguageContext);
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { dark, setDark } = useContext(ThemeContext);

  const t = translations[language];
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleChangeLang = (lang) => {
    changeLanguage(lang);
    setMenuOpen(false);
  };




  return (
    <nav className="navbar">



      {/* LEFT */}
      <div className="nav-left" onClick={() => handleNavigate("/")}>
        <h2>{t.title}</h2>
      </div>

      {/* HAMBURGER */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>




          {/* RIGHT MENU */}
      <div className={`nav-right ${menuOpen ? "open" : ""}`}>

          <button className="nav-btn" onClick={() => handleNavigate("/")}>
            {t.home}
          </button>

          <button className="nav-btn" onClick={() => handleNavigate("/contact")}>
            {t.contact.contact}
          </button>

          {user ? (
            <>
              <span className="nav-btn user-label">👤 {user.name}</span>

              {user?.role === "admin" && (
                <button className="nav-btn" onClick={() => handleNavigate("/admin")}>
                  Admin
                </button>
              )}

              <button
                className="nav-btn"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="nav-btn" onClick={() => handleNavigate("/login")}>
                {t.loginButton}
              </button>

              <button className="nav-btn" onClick={() => handleNavigate("/register")}>
                {t.registerButton}
              </button>
            </>
          )}

          <button className="nav-btn" onClick={() => handleNavigate("/cart")}>
            🛒 ({cartCount})
          </button>

          <div className="flags">
            {["en", "es", "de"].map((lang) => (
              <img
                key={lang}
                src={process.env.PUBLIC_URL + `/flags/${lang}.png`}
                alt={lang}
                onClick={() => handleChangeLang(lang)}
              />
            ))}
          </div>

          <button className="nav-btn" onClick={() => setDark(!dark)}>
            {dark ? "☀️" : "🌙"}
          </button>

      </div>
    </nav>
  );
}

export default Navbar;