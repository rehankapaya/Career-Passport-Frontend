import React from "react";
import { Link } from "react-router-dom";
import "./FooterComponent.css";

export default function FooterComponent() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo + Description */}
        <div className="footer-section">
          <h2 className="footer-logo">PathSeeker</h2>
          <p className="footer-text">
            Guiding students, graduates, and professionals to discover the best
            career paths tailored to their skills and interests.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-section">
          <h3>Resources</h3>
          <ul>
            <li><Link to="/careers">Career Bank</Link></li>
            <li><Link to="/quiz">Interest Quiz</Link></li>
            <li><Link to="/stories">Success Stories</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} PathSeeker. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
