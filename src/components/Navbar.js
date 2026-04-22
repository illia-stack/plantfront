import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { translations } from "../translations";
import logo from "../logo.svg";

function Navbar() {
  const { language, changeLanguage } = useContext(LanguageContext);
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
        <img src={logo} alt="logo" className="logo" />
        <h2>{t.title}</h2>
      </div>

      {/* HAMBURGER */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* RIGHT MENU */}
      <div className={`nav-right ${menuOpen ? "open" : ""}`}>

        <div className="nav-item" onClick={() => handleNavigate("/")}>
          {t.home}
        </div>

        <div className="nav-item" onClick={() => handleNavigate("/cart")}>
          🛒 ({cartCount})
        </div>

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

        <button className="theme-btn" onClick={() => setDark(!dark)}>
          {dark ? "☀️" : "🌙"}
        </button>

      </div>
    </nav>
  );
}

export default Navbar;