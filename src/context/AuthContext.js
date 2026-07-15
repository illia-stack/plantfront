import { createContext, useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "../config";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState(null);

  // 🔹 Always fetch CSRF without authFetch 
  const csrfPromiseRef = useRef(null);

  const fetchCsrfToken = async () => {
    if (csrfPromiseRef.current) return csrfPromiseRef.current;

    csrfPromiseRef.current = (async () => {
      const res = await fetch(`${API_BASE_URL}/csrf.php`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch CSRF token");
      }
      
      const data = await res.json();

      if (!data?.csrfToken) {
        throw new Error("Missing CSRF token");
      }

      setCsrfToken(data.csrfToken);
      csrfPromiseRef.current = null;

      return data.csrfToken;
    })();

    return csrfPromiseRef.current;
  };


  // 🔹 Centralized fetch helper
  const authFetch = async (url, options = {}, retry = true) => {

    let token = csrfToken;

    if (!token) {
      token = await fetchCsrfToken();
    }

    const headers = {
      ...(options.headers || {}),
      "X-CSRF-Token": token, 
    };  

    if (options.body && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    let body = options.body;

    if (body && !(body instanceof FormData)) {
      const parsed = JSON.parse(body);
      body = JSON.stringify(parsed);
    }

    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers,
      body,
    });


    
    // 🔁 1. Retry  CSRF fetch
    if (res.status === 403 && retry) {
      await fetchCsrfToken();
      return authFetch(url, options, false);
    }

    
    if (res.status === 403 && !retry) {
      setUser(null);

      throw new Error("SESSION_EXPIRED");
    }

    
    if (res.status === 401) {
      setUser(null);
      throw new Error("UNAUTHORIZED");
    }

    return res;

  };


  // 🔹 Initialize session + user
  const initializeAuth = async () => {

    try {
          
      const meRes = await authFetch(`${API_BASE_URL}/me.php`);

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


  // 🔹 Login → sync + new CSRF
  const login = async () => {
    try {
      csrfPromiseRef.current = null; 
      await fetchCsrfToken();

      const meRes = await authFetch(`${API_BASE_URL}/me.php`);
      const meData = await meRes.json();

      setUser(meData.user || null);
    } catch (err) {
      console.error("Login sync failed:", err);
      setUser(null);
    }
  };


  // 🔹 Logout
  const logout = async () => {

    try {
      const res = await authFetch(`${API_BASE_URL}/logout.php`, {
        method: "POST",
      });

      const data = await res.json();

      setUser(null);

      if (data?.csrfToken) {
        setCsrfToken(data.csrfToken);
        
      } else {
        await fetchCsrfToken(); // fallback
      }

    } catch (err) {
      console.warn("Logout request failed");

      setUser(null);

      try {
        csrfPromiseRef.current = null;
        await fetchCsrfToken(); // fallback
      } catch (e) {
        console.warn("CSRF fallback failed");
      } finally {
      csrfPromiseRef.current = null;
      }

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