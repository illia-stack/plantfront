import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { translations } from "../translations";


function Navbar() {
  const [loggingOut, setLoggingOut] = useState(false);
  const { language, changeLanguage } = useContext(LanguageContext);
  const { user, logout, loading } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { dark, setDark } = useContext(ThemeContext);

  const t = translations[language];
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = (cart || []).reduce((sum, item) => sum + item.quantity, 0);

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


    {/* RIGHT MENU */}
    <div className="nav-right-wrapper">
      {/* HAMBURGER */}
      <div className="hamburger" onClick={() => setMenuOpen(prev => !prev)}>
        ☰
      </div>

      <div className={`nav-right ${menuOpen ? "open" : ""}`}>

          <button className="nav-btn" onClick={() => handleNavigate("/")}>
            {t.home}
          </button>

          <button className="nav-btn" onClick={() => handleNavigate("/contact")}>
            {t.contact.contact}
          </button>

          {loading ? (
            <span className="nav-btn" style={{ opacity: 0.6 }}>
              {t.loading || "..."}
            </span>
          ) : user ? (
            <>
              <span className="nav-btn user-label">👤 {user?.name || "User"}</span>

              {user?.role === "admin" && (
                <button className="nav-btn" onClick={() => handleNavigate("/admin")}>
                  Admin
                </button>
              )}

              <button
                className="nav-btn"
                disabled={loggingOut || loading}
                onClick={async () => {
                  setLoggingOut(true);
                  try {
                    await logout();
                    handleNavigate("/");
                  } catch (err) {
                    console.error("Logout failed", err);
                    alert("Logout failed. Please try again.");
                  } finally {
                    setLoggingOut(false);
                  }
                }}
              >
                {loggingOut ? "..." : "Logout"}
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

          <button className="nav-btn" onClick={() => setDark(prev => !prev)}>
            {dark ? "☀️" : "🌙"}
          </button>

      </div>
    </div>  
    </nav>
  );
}

export default Navbar;