import React, { useState, useContext } from "react";
import axios from "axios";
import { apiurl } from "../api";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const { userlogin } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  // input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // form submit
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiurl}/api/users/login`, formData);
      console.log("Login successful:", response.data);

      toast.success("Login Successful 🎉");
      userlogin(response.data.user);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login Failed");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue your career journey ✨</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="login-options">
            <label className="remember">
              <input type="checkbox" /> Remember me
            </label>
            <a href="/auth/forgot" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account? <a href="/auth/register">Sign up here</a>
        </p>
      </div>
    </div>
  );
}
