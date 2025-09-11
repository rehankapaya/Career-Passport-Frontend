import React, { useState } from "react";
import axios from "axios";
import { apiurl } from "../api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./LoginPage.css";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: email input, 2: OTP input, 3: new password
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

  return (
    <div className="login-container">
      <div className="login-card">
        {step === 1 && (
          <>
            <h2 className="login-title">Reset Your Password</h2>
            <p className="login-subtitle">
              Enter your email address and we'll send you an OTP to reset your password
            </p>

            <form className="login-form" onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="login-title">Verify OTP</h2>
            <p className="login-subtitle">
              Enter the OTP sent to {email} and your new password
            </p>

            <form className="login-form" onSubmit={handleOtpSubmit}>
              <div className="form-group">
                <label htmlFor="otp">OTP Code</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              
              <div className="resend-otp">
                <p>
                  Didn't receive the OTP?{" "}
                  <button 
                    type="button" 
                    onClick={handleResendOtp}
                    className="resend-link"
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
            <h2 className="login-title">Password Reset Successful!</h2>
            <div className="success-icon">✓</div>
            <p className="login-subtitle">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            
            <Link to="/login" className="login-btn">
              Back to Login
            </Link>
          </>
        )}

        <p className="login-footer">
          Remember your password? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}