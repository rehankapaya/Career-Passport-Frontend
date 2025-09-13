import React, { useState, useContext } from "react";
import axios from "axios";
import { apiurl } from "../api";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function UnifiedLogin() {
  const { userlogin } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Decide where to go after a successful login based on response shape/role
  function handleSuccessfulLogin(resp, source) {
    // Normalize payload (supports admin/user shapes)
    const data = resp?.data || {};
    const userLike =
      data.user || data.admin || data.profile || data.account || data; // fallback

    // Persist via your context
    userlogin(userLike);

    // Try to infer role (prefer explicit role flags, else infer from endpoint)
    const role =
      userLike?.role ||
      userLike?.isAdmin === true ? "admin"
      : userLike?.is_admin === true ? "admin"
      : source === "admin" ? "admin"
      : "user";

    if (role === "admin") {
      toast.success("Admin Login Successful");
      navigate("/admin/dashboard");
    } else {
      toast.success("Login Successful");
      navigate("/");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1) Try admin login first
      const adminResp = await axios.post(`${apiurl}/api/admin/login`, formData, {
        validateStatus: () => true, // we'll branch manually on status
      });

      if (adminResp.status >= 200 && adminResp.status < 300) {
        handleSuccessfulLogin(adminResp, "admin");
        return;
      }

      // If admin refused (401/403/404 etc.), fallback to user login
      const userResp = await axios.post(`${apiurl}/api/users/login`, formData, {
        validateStatus: () => true,
      });

      if (userResp.status >= 200 && userResp.status < 300) {
        handleSuccessfulLogin(userResp, "user");
        return;
      }

      // Both failed -> choose the most useful message we have
      const adminMsg = adminResp?.data?.message;
      const userMsg = userResp?.data?.message;
      const finalMsg =
        userMsg || adminMsg || "Invalid email or password. Please try again.";
      toast.error(finalMsg);
    } catch (err) {
      console.error("Combined login error:", err);
      toast.error("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // ==== inline styles (reused from your pages) ====
  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #444",
    backgroundColor: "#3b3b3b",
    color: "#e0e0e0",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    color: "#e0e0e0",
    textAlign: "left",
    fontWeight: "500",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "0.5rem",
    fontSize: "1rem",
    opacity: loading ? 0.8 : 1,
  };

  const linkStyle = {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  };

  const footerTextStyle = {
    marginTop: "1.5rem",
    color: "#a0a0a0",
    fontSize: "0.875rem",
  };

  const loginOptionsStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.875rem",
    color: "#a0a0a0",
    marginTop: "0.5rem",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        fontFamily: "sans-serif",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#2d2d2d",
          padding: "2.5rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
          width: "100%",
          maxWidth: "24rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            color: "#e0e0e0",
          }}
        >
          Welcome Back
        </h2>
        <p style={{ color: "#a0a0a0", marginBottom: "1.5rem" }}>
          Login to continue your journey ✨
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label htmlFor="email" style={labelStyle}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              style={inputStyle}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={inputStyle}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <div style={loginOptionsStyle}>
            <label style={{ margin: 0 }}>
              <input type="checkbox" style={{ marginRight: "0.5rem" }} /> Remember me
            </label>
            <Link to="/password-reset" style={linkStyle}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={footerTextStyle}>
          Don’t have an account?{" "}
          <Link to="/signup" style={linkStyle}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
