import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";


function Navbar() {
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, logout, loading } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { dark, setDark } = useContext(ThemeContext);

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };


  return (
    <nav className="navbar">



      {/* LEFT */}
      <div className="nav-left" onClick={() => handleNavigate("/")}>
        <h2>Indoor Gardening Plants - JUST PORTFOLIO PROJECT</h2>
      </div>


    {/* RIGHT MENU */}
    <div className="nav-right-wrapper">
      {/* HAMBURGER */}
     <button
        className="hamburger"
        onClick={() => setMenuOpen(prev => !prev)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <div className={`nav-right ${menuOpen ? "open" : ""}`}>

          <button className="nav-btn" onClick={() => handleNavigate("/")}>
            Home
          </button>

          <button className="nav-btn" onClick={() => handleNavigate("/contact")}>
            Contact Us
          </button>

          {loading ? (
            <span className="nav-btn" style={{ opacity: 0.6 }}>
              Loading...
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
                disabled={loggingOut}
                onClick={async () => {
                  setLoggingOut(true);
                  try {
                    await logout();
                    navigate("/", { replace: true });
                    setMenuOpen(false);
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
                Login
              </button>

              <button className="nav-btn" onClick={() => handleNavigate("/register")}>
                Register
              </button>
            </>
          )}

          <button className="nav-btn" onClick={() => handleNavigate("/cart")}>
            🛒 ({cartCount})
          </button>

          

          <button className="nav-btn" onClick={() => setDark(prev => !prev)}>
            {dark ? "☀️" : "🌙"}
          </button>

      </div>
    </div>  
    </nav>
  );
}

export default Navbar;