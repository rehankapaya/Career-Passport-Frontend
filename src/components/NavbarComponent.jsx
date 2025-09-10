import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavbarComponent.css";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function NavbarComponent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, userlogout } = useContext(UserContext)
  const navigate = useNavigate()

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">PathSeeker</div>

      {/* Nav Links */}
      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        {user ? <Link to="/login" onClick={() => setMenuOpen(false)} className="login-btn">
          Login
        </Link>:
        <Link onClick={() => {userlogout(); navigate('/')}} className="login-btn">
          Logout
        </Link>
        }
      </nav>

      {/* Hamburger (Mobile) */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >

        Bu
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}
