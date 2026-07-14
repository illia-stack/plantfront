import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";


function Login() {
  
  const { login, authFetch, loading: authLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // ✅ Use centralized fetch
      const res = await authFetch(`${API_BASE_URL}/login.php`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Unexpected server response");
      }


      const data = await res.json().catch(() => {
        throw new Error("Invalid server response");
      });

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Login failed");
      }

      // ✅ Let AuthContext sync user
      await login();

      alert("Logged in!");
      navigate("/", { replace: true });

    } catch (err) {

        if (err.message === "SESSION_EXPIRED") {
          alert("Session expired. Please try again.");
          return;
        }

        if (err.message === "UNAUTHORIZED") {
          alert("Login failed");
          return;
        }

        alert(err.message || "Login failed");
    } finally {
      setLoading(false);
      }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <h2>Login</h2>

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >

          <input
            type="email"
            placeholder="Enter your e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>

        </form>

        <div className="auth-switch">
          {"No account?"}
          <span
            className="auth-link"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </div>

      </div>
    </div>
  );
}

export default Login;