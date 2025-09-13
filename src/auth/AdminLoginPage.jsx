import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { apiurl } from "../api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Mail, Lock, LogIn, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const { userlogin } = useContext(UserContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiurl}/api/admin/login`, formData);
      toast.success("Admin Login Successful");
      userlogin(response.data);
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f3f2ef",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "2.25rem",
          borderRadius: "16px",
          boxShadow: "0 18px 48px rgba(10,102,194,0.15)",
          width: "100%",
          maxWidth: "26rem",
          textAlign: "center",
          border: "1px solid #e9ecef",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "3rem",
            height: "3rem",
            borderRadius: "999px",
            background: "#e7f0fa",
            marginBottom: "0.75rem",
          }}
        >
          <Shield size={22} color="#0a66c2" />
        </div>
        <h2
          style={{
            fontSize: "1.9rem",
            fontWeight: 800,
            marginBottom: "0.35rem",
            color: "#1f2328",
            letterSpacing: "-0.3px",
          }}
        >
          Admin Panel
        </h2>
        <p
          style={{
            color: "#5a6b7b",
            marginBottom: "1.4rem",
            fontSize: "0.98rem",
            lineHeight: 1.5,
          }}
        >
          Sign in with your admin details
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div style={{ textAlign: "left" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#1f2328",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              Admin Email
            </label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  opacity: 0.9,
                }}
              >
                <Mail size={18} color="#0a66c2" />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter admin email"
                required
                style={{
                  width: "100%",
                  padding: "0.78rem 0.9rem 0.78rem 2.3rem",
                  borderRadius: "10px",
                  border: "1px solid #d0d7de",
                  backgroundColor: "#ffffff",
                  color: "#1f2328",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "box-shadow .15s ease, border-color .15s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,102,194,0.15)";
                  e.currentTarget.style.borderColor = "#0a66c2";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#d0d7de";
                }}
              />
            </div>
          </div>

          <div style={{ textAlign: "left" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#1f2328",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              Admin Password
            </label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  opacity: 0.9,
                }}
              >
                <Lock size={18} color="#0a66c2" />
              </div>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter admin password"
                required
                style={{
                  width: "100%",
                  padding: "0.78rem 0.9rem 0.78rem 2.3rem",
                  borderRadius: "10px",
                  border: "1px solid #d0d7de",
                  backgroundColor: "#ffffff",
                  color: "#1f2328",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "box-shadow .15s ease, border-color .15s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,102,194,0.15)";
                  e.currentTarget.style.borderColor = "#0a66c2";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#d0d7de";
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.9rem",
              backgroundColor: "#0a66c2",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontWeight: 800,
              cursor: "pointer",
              marginTop: "0.25rem",
              fontSize: "1rem",
              letterSpacing: "0.2px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: "0 10px 24px rgba(10,102,194,0.20)",
              transition: "transform .06s ease, background-color .15s ease",
            }}
            onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "#004182")}
            onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#0a66c2")}
          >
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
