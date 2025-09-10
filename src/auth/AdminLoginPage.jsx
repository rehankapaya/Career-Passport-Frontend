import React, { useState, useContext } from "react";
import axios from "axios";
import { apiurl } from "../api";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AdminLoginPage.css";

export default function AdminLoginPage() {
  const { userlogin } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiurl}/api/admin/login`, formData);
      console.log("Login successful:", response.data);
      toast.success("Admin Login Successful");
      userlogin(response.data);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login Failed");
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Admin Panel</h2>
        <p className="admin-login-subtitle">
          Please login with your admin credentials ⚡
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter admin password"
              required
            />
          </div>

          <button type="submit" className="admin-login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
