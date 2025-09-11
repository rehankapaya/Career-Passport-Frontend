import React, { useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

export default function SignupPage() {
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

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return;
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
            Create Your Account
          </h2>
          <p style={{
            color: '#a0a0a0',
            marginBottom: '1.5rem'
          }}>
            Join PathSeeker and start your career journey today 🚀
          </p>

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div>
              <label htmlFor="uname" style={labelStyle}>Full Name</label>
              <input
                type="text"
                id="uname"
                name="uname"
                value={uname}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                style={inputStyle}
              />
            </div>

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
              <label htmlFor="role" style={labelStyle}>Select Role</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Choose your role</option>
                <option value="student">Student</option>
                <option value="graduate">Graduate</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" style={labelStyle}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              style={{
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
              }}
            >
              Sign Up
            </button>
          </form>

          <p style={{
            marginTop: '1.5rem',
            color: '#a0a0a0',
            fontSize: '0.875rem'
          }}>
            Already have an account? <Link to="/login" style={{
              color: '#007bff',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>Login here</Link>
          </p>
        </div>
      </div>
  );
}
