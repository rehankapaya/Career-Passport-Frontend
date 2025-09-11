import React, { useState } from "react";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      console.log("Admin login successful with:", formData);
      // toast.success("Admin Login Successful");
      setLoading(false);
      // navigate("/admin/dashboard");
    }, 1500);
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    fontFamily: 'sans-serif',
    padding: '2rem'
  };

  const cardStyle = {
    backgroundColor: '#2d2d2d',
    padding: '2.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '24rem',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#e0e0e0'
  };

  const subtitleStyle = {
    color: '#a0a0a0',
    marginBottom: '1.5rem'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  };

  const labelStyle = {
    marginBottom: '0.5rem',
    color: '#e0e0e0',
    textAlign: 'left',
    fontWeight: '500'
  };

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

  return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Admin Panel</h2>
          <p style={subtitleStyle}>
            Please login with your admin credentials ⚡
          </p>

          <form style={formStyle} onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
              <label htmlFor="email" style={labelStyle}>Admin Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter admin email"
                required
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="password" style={labelStyle}>Admin Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter admin password"
                required
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              style={buttonStyle}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
  );
}
