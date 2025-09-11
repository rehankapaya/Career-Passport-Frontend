import React, { useState, useContext } from "react";
import axios from "axios";
import { apiurl } from "../api";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

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
  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #444',
    backgroundColor: '#3b3b3b',
    color: '#e0e0e0',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#e0e0e0',
    textAlign: 'left',
    fontWeight: '500'
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
    fontSize: '1rem'
  };

  const linkStyle = {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold'
  };

  const footerTextStyle = {
    marginTop: '1.5rem',
    color: '#a0a0a0',
    fontSize: '0.875rem'
  };

  const loginOptionsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#a0a0a0',
    marginTop: '0.5rem'
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      fontFamily: 'sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#2d2d2d',
        padding: '2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '24rem',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#e0e0e0'
        }}>
          Welcome Back
        </h2>
        <p style={{
          color: '#a0a0a0',
          marginBottom: '1.5rem'
        }}>
          Login to continue your career journey ✨
        </p>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div>
            <label htmlFor="email" style={labelStyle}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={inputStyle}
            />
          </div>

          <div style={loginOptionsStyle}>
            <label style={{ margin: 0 }}>
              <input type="checkbox" style={{ marginRight: '0.5rem' }} /> Remember me
            </label>
            <Link to="/password-reset" style={linkStyle}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>

        <p style={footerTextStyle}>
          Don’t have an account? <Link to="/signup" style={linkStyle}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
