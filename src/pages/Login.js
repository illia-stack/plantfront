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
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // ✅ Centralized fetch
      const res = await authFetch(`${API_BASE_URL}/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

         

          <div className="password-field">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="password"
              required
            />


            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          
          </div>



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