import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

function Register() {
  
  const { login, authFetch, loading: authLoading } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
   if (loading) return;

    
    setLoading(true);

    try {
      // ✅ Use centralized fetch
      const res = await authFetch(`${API_BASE_URL}/register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password }),
      });

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Unexpected server response");
      }

      const data = await res.json().catch(() => {
        throw new Error("Invalid server response");
      });

      if (!res.ok) {
        if (data?.errors) {
          setErrors(data.errors);
          return;
        }
        throw new Error(data?.message || "Registration failed");
      }
      
      setErrors({});


      alert("Registration successful!");

      // ✅ Let AuthContext re-sync from backend
      await login();

      navigate("/", { replace: true });

    } catch (err) {

        if (err.message === "SESSION_EXPIRED") {
          alert("Session expired. Please refresh the page.");
          window.location.reload();
          return;
        }

        if (err.message === "UNAUTHORIZED") {
          alert("Registration failed");
          return;
        }

        // ✅ Fallback 
        alert("Registration failed");
    } finally {
          setLoading(false);
      }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <h2>Register</h2>

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >

          
          {errors.general && (
            <div className="error">
              {errors.general.map((err, i) => <div key={i}>{err}</div>)}
            </div>
          )}



          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined, general: undefined }));
            }}
            required
          />

          {errors.name && (
            <div className="error">
              {errors.name.map((err, i) => <div key={i}>{err}</div>)}
            </div>
          )}



          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
            }}
            required
          />

          {errors.email && (
            <div className="error">
              {errors.email.map((err, i) => <div key={i}>{err}</div>)}
            </div>
          )}




          <div className="password-field">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
              }}
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

          {errors.password && (
            <div className="error">
              {errors.password.map((err, i) => <div key={i}>{err}</div>)}
            </div>
          )}




          <button className="auth-btn" type="submit"  disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </button>


        </form>



        <div className="auth-switch">
          {"Already have an account?"}
          <span
            className="auth-link"
            onClick={() => navigate("/login")}
          >
            {"Login"}
          </span>
        </div>

      </div>
    </div>
  );
}

export default Register;