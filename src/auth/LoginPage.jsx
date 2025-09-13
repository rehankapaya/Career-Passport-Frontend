import React, { useState, useContext } from "react";
import axios from "axios";
import { apiurl } from "../api";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const { userlogin } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiurl}/api/user/login`, formData);
      toast.success("Login Successful");
      userlogin(response.data.user);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  }

  const primary = "#0A66C2";
  const deep = "#004182";
  const ink = "#1D2226";
  const line = "#E6E9EC";
  const haze = "#F3F6F8";

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
          maxWidth: 380,
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

        <h2
          style={{
            margin: 0,
            marginBottom: 6,
            fontSize: 22,
            fontWeight: 800,
            color: deep,
            letterSpacing: 0.2
          }}
        >
          Welcome back
        </h2>
        <div style={{ color: "#6B7280", fontSize: 14, marginBottom: 18 }}>
          Sign in to continue your journey
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: 6,
                color: "#374151",
                fontWeight: 600,
                fontSize: 13
              }}
            >
              Email address
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid " + line,
                background: "#fff",
                borderRadius: 10,
                padding: "10px 12px"
              }}
            >
              <Mail size={18} style={{ color: primary }} />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 14,
                  color: ink,
                  background: "transparent"
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: 6,
                color: "#374151",
                fontWeight: 600,
                fontSize: 13
              }}
            >
              Password
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid " + line,
                background: "#fff",
                borderRadius: 10,
                padding: "10px 12px"
              }}
            >
              <Lock size={18} style={{ color: primary }} />
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Your password"
                required
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 14,
                  color: ink,
                  background: "transparent"
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
              color: "#6B7280"
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" style={{ width: 16, height: 16 }} /> Remember me
            </label>
            <Link
              to="/password-reset"
              style={{ color: primary, textDecoration: "none", fontWeight: 700 }}
            >
              Forgot password
            </Link>
          </div>

          <button
            type="submit"
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
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(10,102,194,0.28)"
            }}
          >
            <LogIn size={18} />
            Login
          </button>
        </form>

        <div
          style={{
            marginTop: 16,
            fontSize: 14,
            color: "#6B7280",
            textAlign: "center"
          }}
        >
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: primary, textDecoration: "none", fontWeight: 800 }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
