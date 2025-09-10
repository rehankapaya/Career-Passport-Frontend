import React, { useState, useContext } from "react";
import axios from "axios";
import { apiurl } from "../api";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "./SignupPage.css";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const { userlogin } = useContext(UserContext);

  const [formData, setFormData] = useState({
    uname: "",
    email: "",
    password: "",
    role: "",
    confirmPassword: "",
  });

  const { uname, email, password, role, confirmPassword } = formData;

  // handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle submit
  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    try {
      const response = await axios.post(`${apiurl}/api/users/register`, {
        uname,
        email,
        password,
        role,
      });

      console.log("Signup successful:", response.data);
      toast.success("Signup Successful 🎉");

      // agar signup ke baad auto login karwana ho
      if (response.data.user) {
        userlogin(response.data.user);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(error.response?.data?.message || "Signup Failed");
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Your Account</h2>
        <p className="signup-subtitle">
          Join PathSeeker and start your career journey today 🚀
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="uname">Full Name</label>
            <input
              type="text"
              id="uname"
              name="uname"
              value={uname}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

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
            <label htmlFor="role">Select Role</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={handleChange}
              required
            >
              <option value="">Choose your role</option>
              <option value="student">Student</option>
              <option value="graduate">Graduate</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
            />
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
