import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavbarComponent.css";

export default function NavbarComponent() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <Link to="/login" onClick={() => setMenuOpen(false)} className="login-btn">
          Login
        </Link>
      </nav>

      {/* Hamburger (Mobile) */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}
