import React, { useState } from "react";
import axios from "axios";
import { apiurl } from "../api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Mail, KeyRound, Lock, RotateCcw, CheckCircle2, Shield } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const brand = "#0a66c2";
  const brandDark = "#004182";

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${apiurl}/api/users/forgot-password`, { email });
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${apiurl}/api/users/reset-password`, { email, otp, newPassword });
      toast.success("Password reset successfully");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${apiurl}/api/users/forgot-password`, { email });
      toast.success("New OTP sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const inputBase = {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: "0.85rem 0.95rem 0.85rem 2.35rem",
    borderRadius: "10px",
    border: "1px solid #d0d7de",
    background: "#fff",
    outline: "none",
    transition: "box-shadow .15s ease, border-color .15s ease"
  };

  const focusOn = (e) => {
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,102,194,0.15)";
    e.currentTarget.style.borderColor = brand;
  };
  const focusOff = (e) => {
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.borderColor = "#d0d7de";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f2ef",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: "#1f2328"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "28rem",
          background: "#ffffff",
          border: "1px solid #e9ecef",
          borderRadius: "16px",
          boxShadow: "0 18px 48px rgba(10,102,194,0.15)",
          padding: "2.25rem",
          textAlign: "center",
          boxSizing: "border-box"
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
            marginBottom: "0.85rem"
          }}
        >
          <Shield size={22} color={brand} />
        </div>

        {step === 1 && (
          <>
            <h2
              style={{
                fontSize: "1.9rem",
                fontWeight: 800,
                letterSpacing: "-0.3px",
                marginBottom: "0.35rem"
              }}
            >
              Reset Your Password
            </h2>
            <p
              style={{
                color: "#5a6b7b",
                fontSize: "0.98rem",
                lineHeight: 1.5,
                marginBottom: "1.4rem"
              }}
            >
              Pop in your email and we’ll send over a quick OTP.
            </p>

            <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
              <div style={{ textAlign: "left", width: "100%" }}>
                <label htmlFor="email" style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
                  Email Address
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      opacity: 0.9
                    }}
                  >
                    <Mail size={18} color={brand} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={inputBase}
                    onFocus={focusOn}
                    onBlur={focusOff}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.95rem",
                  backgroundColor: brand,
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  letterSpacing: "0.2px",
                  cursor: "pointer",
                  boxShadow: "0 10px 24px rgba(10,102,194,0.2)",
                  transition: "background-color .15s ease"
                }}
                onMouseDown={(e) => (e.currentTarget.style.backgroundColor = brandDark)}
                onMouseUp={(e) => (e.currentTarget.style.backgroundColor = brand)}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2
              style={{
                fontSize: "1.9rem",
                fontWeight: 800,
                letterSpacing: "-0.3px",
                marginBottom: "0.35rem"
              }}
            >
              Verify OTP
            </h2>
            <p
              style={{
                color: "#5a6b7b",
                fontSize: "0.98rem",
                lineHeight: 1.5,
                marginBottom: "1.4rem"
              }}
            >
              Enter the code sent to {email} and set a new password.
            </p>

            <form onSubmit={handleOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
              <div style={{ textAlign: "left", width: "100%" }}>
                <label htmlFor="otp" style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
                  OTP Code
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      opacity: 0.9
                    }}
                  >
                    <KeyRound size={18} color={brand} />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit code"
                    required
                    style={inputBase}
                    onFocus={focusOn}
                    onBlur={focusOff}
                  />
                </div>
              </div>

              <div style={{ textAlign: "left", width: "100%" }}>
                <label htmlFor="newPassword" style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
                  New Password
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      opacity: 0.9
                    }}
                  >
                    <Lock size={18} color={brand} />
                  </div>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a new password"
                    required
                    style={inputBase}
                    onFocus={focusOn}
                    onBlur={focusOff}
                  />
                </div>
              </div>

              <div style={{ textAlign: "left", width: "100%" }}>
                <label htmlFor="confirmPassword" style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
                  Confirm Password
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      opacity: 0.9
                    }}
                  >
                    <Lock size={18} color={brand} />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Type it again"
                    required
                    style={inputBase}
                    onFocus={focusOn}
                    onBlur={focusOff}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.95rem",
                  backgroundColor: brand,
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  letterSpacing: "0.2px",
                  cursor: "pointer",
                  boxShadow: "0 10px 24px rgba(10,102,194,0.2)",
                  transition: "background-color .15s ease"
                }}
                onMouseDown={(e) => (e.currentTarget.style.backgroundColor = brandDark)}
                onMouseUp={(e) => (e.currentTarget.style.backgroundColor = brand)}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <div style={{ marginTop: "0.75rem", color: "#5a6b7b", fontSize: "0.92rem" }}>
                Didn’t get it?
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: brand,
                    fontWeight: 700,
                    cursor: "pointer",
                    marginLeft: "0.35rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".35rem",
                    padding: 0
                  }}
                >
                  <RotateCcw size={16} />
                  Resend OTP
                </button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ marginBottom: "0.6rem" }}>
              <CheckCircle2 size={48} color="#16a34a" />
            </div>
            <h2
              style={{
                fontSize: "1.9rem",
                fontWeight: 800,
                letterSpacing: "-0.3px",
                marginBottom: "0.35rem"
              }}
            >
              Password Reset
            </h2>
            <p
              style={{
                color: "#5a6b7b",
                fontSize: "0.98rem",
                lineHeight: 1.5,
                marginBottom: "1.2rem"
              }}
            >
              All set. You can log in with your new password now.
            </p>

            <Link
              to="/login"
              style={{
                display: "inline-block",
                width: "100%",
                textAlign: "center",
                padding: "0.95rem",
                backgroundColor: brand,
                color: "#fff",
                borderRadius: "12px",
                fontWeight: 800,
                letterSpacing: "0.2px",
                textDecoration: "none",
                boxShadow: "0 10px 24px rgba(10,102,194,0.2)"
              }}
              onMouseDown={(e) => (e.currentTarget.style.backgroundColor = brandDark)}
              onMouseUp={(e) => (e.currentTarget.style.backgroundColor = brand)}
            >
              Back to Login
            </Link>
          </>
        )}

        <p style={{ marginTop: "1.25rem", color: "#5a6b7b", fontSize: "0.95rem" }}>
          Remember your password?{" "}
          <Link to="/login" style={{ color: brand, fontWeight: 700, textDecoration: "none" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
