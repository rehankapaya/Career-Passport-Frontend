import React, { useState } from "react";
import axios from "axios";
import { apiurl } from "../api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

// Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${apiurl}/api/users/forgot-password`, { email });
      console.log("OTP sent:", response.data);
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${apiurl}/api/users/reset-password`, {
        email,
        otp,
        newPassword
      });
      console.log("Password reset:", response.data);
      toast.success("Password reset successfully!");
      setStep(3);
    } catch (error) {
      console.error("Failed to reset password:", error);
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    
    try {
      const response = await axios.post(`${apiurl}/api/users/forgot-password`, { email });
      console.log("OTP resent:", response.data);
      toast.success("New OTP sent to your email!");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
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

  const footerStyle = {
    marginTop: '1.5rem',
    color: '#a0a0a0',
    fontSize: '0.875rem'
  };
  
  const linkStyle = {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold'
  };

  const resendContainerStyle = {
    marginTop: '1rem',
    color: '#a0a0a0',
    fontSize: '0.875rem'
  };

  const resendButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#007bff',
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    padding: '0',
    marginLeft: '0.25rem'
  };

  const successIconStyle = {
    fontSize: '3rem',
    color: '#28a745',
    marginBottom: '1rem'
  };

  return (
    
      <div style={containerStyle}>
        <div style={cardStyle}>
          {step === 1 && (
            <>
              <h2 style={titleStyle}>Reset Your Password</h2>
              <p style={subtitleStyle}>
                Enter your email address and we'll send you an OTP to reset your password
              </p>

              <form style={formStyle} onSubmit={handleEmailSubmit}>
                <div style={formGroupStyle}>
                  <label htmlFor="email" style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={inputStyle}
                  />
                </div>

                <button 
                  type="submit" 
                  style={buttonStyle}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={titleStyle}>Verify OTP</h2>
              <p style={subtitleStyle}>
                Enter the OTP sent to {email} and your new password
              </p>

              <form style={formStyle} onSubmit={handleOtpSubmit}>
                <div style={formGroupStyle}>
                  <label htmlFor="otp" style={labelStyle}>OTP Code</label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label htmlFor="newPassword" style={labelStyle}>New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    style={inputStyle}
                  />
                </div>

                <button 
                  type="submit" 
                  style={buttonStyle}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
                
                <div style={resendContainerStyle}>
                  <p>
                    Didn't receive the OTP?{" "}
                    <button 
                      type="button" 
                      onClick={handleResendOtp}
                      style={resendButtonStyle}
                      disabled={loading}
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={titleStyle}>Password Reset Successful!</h2>
              <div style={successIconStyle}>✓</div>
              <p style={subtitleStyle}>
                Your password has been reset successfully. You can now login with your new password.
              </p>
              
              <Link to="/login" style={{...buttonStyle, display: 'block', textAlign: 'center'}}>
                Back to Login
              </Link>
            </>
          )}

          <p style={footerStyle}>
            Remember your password? <Link to="/login" style={linkStyle}>Login here</Link>
          </p>
        </div>
      </div>
    
  );
}
