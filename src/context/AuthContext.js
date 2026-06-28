import { createContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState(null);

  // ✅ Centralized fetch helper
  const authFetch = async (url, options = {}) => {
    const isJson = options.body &&
    typeof options.body === "string" &&
    !(options.headers && options.headers["Content-Type"]);

    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(isJson ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
        ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      },
    });

    if (res.status === 401) {
      setUser(null);
    }

    return res;
  };

  // ✅ Initialize session + user
  const initializeAuth = async () => {
    try {
      // 1. Get CSRF token
      const csrfRes = await fetch(`${API_BASE_URL}/csrf.php`, {
        credentials: "include",
      });

      if (!csrfRes.ok) throw new Error("CSRF init failed");

      const csrfData = await csrfRes.json();
      setCsrfToken(csrfData.csrfToken);

      // 2. Get user
      const meRes = await fetch(`${API_BASE_URL}/me.php`, {
        credentials: "include",
      });

      if (!meRes.ok) throw new Error("Failed to fetch user");

      const meData = await meRes.json();
      setUser(meData.user || null);

    } catch (err) {
      console.error("Auth init failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  // ✅ Login → ALWAYS re-sync from backend
  const login = async () => {
    try {
      // refresh CSRF
      const csrfRes = await fetch(`${API_BASE_URL}/csrf.php`, {
        credentials: "include",
      });
      const csrfData = await csrfRes.json();
      setCsrfToken(csrfData.csrfToken);

      // get user from backend (source of truth)
      const meRes = await fetch(`${API_BASE_URL}/me.php`, {
        credentials: "include",
      });
      const meData = await meRes.json();

      setUser(meData.user || null);

    } catch (err) {
      console.error("Login sync failed:", err);
      setUser(null);
    }
  };

  // ✅ Logout
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

    // refresh CSRF after logout
    try {
      const csrfRes = await fetch(`${API_BASE_URL}/csrf.php`, {
        credentials: "include",
      });
      const csrfData = await csrfRes.json();
      setCsrfToken(csrfData.csrfToken);
    } catch (err) {
      console.warn("CSRF refresh after logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        csrfToken,
        login,
        logout,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};