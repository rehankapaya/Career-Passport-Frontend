import React, { useState, useContext } from "react";
import axios from "axios";
import { apiurl } from "../api";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Compass, User as UserIcon, Mail, Lock, UserPlus, BadgeCheck } from "lucide-react";

export default function SignupPage() {
  const { userlogin } = useContext(UserContext);
  const [formData, setFormData] = useState({ uname: "", email: "", password: "", role: "", confirmPassword: "" });
  const { uname, email, password, role, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`${apiurl}/api/users/register`, { uname, email, password, role });
      toast.success("Signup Successful");
      if (response.data.user) userlogin(response.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup Failed");
    }
  }

  const primary = "#0A66C2";
  const deep = "#004182";
  const ink = "#1D2226";
  const line = "#E6E9EC";
  const haze = "#F3F6F8";

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
          Create your account
        </h2>
        <div style={{ color: "#6B7280", fontSize: 14, marginBottom: 18 }}>Takes a minute. Worth it.</div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div>
            <label htmlFor="uname" style={labelBase}>Full name</label>
            <div style={fieldWrap}>
              <UserIcon size={18} style={{ color: primary }} />
              <input
                type="text"
                id="uname"
                name="uname"
                value={uname}
                onChange={handleChange}
                placeholder="Alex Johnson"
                required
                style={inputBase}
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" style={labelBase}>Select role</label>
            <div style={fieldWrap}>
              <BadgeCheck size={18} style={{ color: primary }} />
              <select
                id="role"
                name="role"
                value={role}
                onChange={handleChange}
                required
                style={{ ...inputBase, appearance: "none", cursor: "pointer" }}
              >
                <option value="">Choose your role</option>
                <option value="student">Student</option>
                <option value="graduate">Graduate</option>
                <option value="professional">Professional</option>
              </select>
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
                placeholder="Create a password"
                required
                style={inputBase}
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" style={labelBase}>Confirm password</label>
            <div style={fieldWrap}>
              <Lock size={18} style={{ color: primary }} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                style={inputBase}
              />
            </div>
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
            <UserPlus size={18} />
            Sign Up
          </button>
        </form>

        <div style={{ marginTop: 16, fontSize: 14, color: "#6B7280", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: primary, textDecoration: "none", fontWeight: 800 }}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
