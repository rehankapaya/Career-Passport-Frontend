import React, { useState, useContext } from "react";
import axios from "axios";
import { apiurl } from "../api";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Mail, Lock, LogIn, ShieldCheck } from "lucide-react";

export default function UnifiedLogin() {
  const { userlogin } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { email, password } = formData;

  const primary = "#0A66C2";
  const deep = "#004182";
  const ink = "#1D2226";
  const line = "#E6E9EC";
  const haze = "#F3F6F8";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  function handleSuccessfulLogin(resp, source) {
    const data = resp?.data || {};
    const userLike = data.user || data.admin || data.profile || data.account || data;
    userlogin(userLike);
    const role =
      userLike?.role ||
      (userLike?.isAdmin === true ? "admin" : userLike?.is_admin === true ? "admin" : source === "admin" ? "admin" : "user");
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
      const adminResp = await axios.post(`${apiurl}/api/admin/login`, formData, { validateStatus: () => true });
      if (adminResp.status >= 200 && adminResp.status < 300) {
        handleSuccessfulLogin(adminResp, "admin");
        return;
      }
      const userResp = await axios.post(`${apiurl}/api/users/login`, formData, { validateStatus: () => true });
      if (userResp.status >= 200 && userResp.status < 300) {
        handleSuccessfulLogin(userResp, "user");
        return;
      }
      const adminMsg = adminResp?.data?.message;
      const userMsg = userResp?.data?.message;
      const finalMsg = userMsg || adminMsg || "Invalid email or password. Please try again.";
      toast.error(finalMsg);
    } catch {
      toast.error("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const fieldWrap = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid " + line,
    background: "#fff",
    borderRadius: 10,
    padding: "10px 12px"
  };

  const inputBase = {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 14,
    color: ink,
    background: "transparent"
  };

  const labelBase = {
    display: "block",
    marginBottom: 6,
    color: "#374151",
    fontWeight: 600,
    fontSize: 13
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: haze,
        fontFamily: 'system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif',
        padding: 24
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          border: "1px solid " + line,
          borderRadius: 12,
          boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
          padding: 24
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: primary,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 6px 14px rgba(10,102,194,0.25)"
            }}
          >
            <Compass size={18} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: ink }}>NextStep Navigator</div>
        </div>

        <h2 style={{ margin: 0, marginBottom: 6, fontSize: 22, fontWeight: 800, color: deep, letterSpacing: 0.2 }}>
          Welcome back
        </h2>
        <div style={{ color: "#6B7280", fontSize: 14, marginBottom: 18 }}>Log in to continue your journey</div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div>
            <label htmlFor="email" style={labelBase}>Email address</label>
            <div style={fieldWrap}>
              <Mail size={18} style={{ color: primary }} />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={inputBase}
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" style={labelBase}>Password</label>
            <div style={fieldWrap}>
              <Lock size={18} style={{ color: primary }} />
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={inputBase}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
              color: "#6B7280",
              marginTop: 4
            }}
          >
            <label style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" style={{ accentColor: primary }} /> Remember me
            </label>
            <Link to="/password-reset" style={{ color: primary, textDecoration: "none", fontWeight: 700 }}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 14px",
              background: primary,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.9 : 1,
              boxShadow: "0 8px 18px rgba(10,102,194,0.28)"
            }}
          >
            {loading ? <ShieldCheck size={18} /> : <LogIn size={18} />}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: 16, fontSize: 14, color: "#6B7280", textAlign: "center" }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: primary, textDecoration: "none", fontWeight: 800 }}>
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}
