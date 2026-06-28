import { createContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 important

  // 🔄 Sync with backend session on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me.php`, {
          credentials: "include",
        });

        const data = await res.json();

        setUser(data.user || null);

        // optional cache
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          localStorage.removeItem("user");
        }

      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Login (after successful API login)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Logout (destroys backend session)
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout.php`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Logout request failed");
    }

    setUser(null);
    localStorage.removeItem("user");
  };

  // 🔄 Sync logout across tabs
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "user" && !event.newValue) {
        setUser(null);
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};