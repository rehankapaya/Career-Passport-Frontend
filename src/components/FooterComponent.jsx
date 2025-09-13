import React from "react";
import { Link } from "react-router-dom";
import { Compass, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";

export default function FooterComponent() {
  const primary = "#0A66C2";
  const bg = "#1D2226";
  const text = "#E6E9EC";
  const subtle = "#2E3A43";

  const linkStyle = { color: text, textDecoration: "none" };
  const sectionTitle = { fontSize: "1rem", fontWeight: 700, marginBottom: 8, color: "#F3F6F8" };
  const item = { marginBottom: 6 };

  return (
    <footer style={{ backgroundColor: bg, color: text, padding: "28px 24px", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", paddingBottom: 16, borderBottom: `1px solid ${subtle}` }}>
          <div style={{ flex: "1 1 260px", minWidth: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: primary, color: "#fff", display: "grid", placeItems: "center", boxShadow: "0 6px 16px rgba(10,102,194,0.35)" }}>
                <Compass size={18} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>NextStep Navigator</h3>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, opacity: 0.9 }}>Guiding your career journey with helpful tips and handy resources, at your pace.</p>
          </div>

          <div style={{ flex: "1 1 180px", minWidth: 180 }}>
            <h4 style={sectionTitle}>Quick Links</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 14 }}>
              <li style={item}><Link to="/" style={linkStyle}>Home</Link></li>
              <li style={item}><Link to="/career-bank" style={linkStyle}>Career Bank</Link></li>
              <li style={item}><Link to="/interest-quiz" style={linkStyle}>Interest Quiz</Link></li>
              <li style={item}><Link to="/resources" style={linkStyle}>Resources</Link></li>
            </ul>
          </div>

          <div style={{ flex: "1 1 180px", minWidth: 180 }}>
            <h4 style={sectionTitle}>Support</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 14 }}>
              <li style={item}><Link to="/help-center" style={linkStyle}>Help Center</Link></li>
              <li style={item}><Link to="/faqs" style={linkStyle}>FAQs</Link></li>
              <li style={item}><Link to="/contact" style={linkStyle}>Contact Us</Link></li>
              <li style={item}><Link to="/privacy-policy" style={linkStyle}>Privacy Policy</Link></li>
            </ul>
          </div>

          <div style={{ flex: "1 1 200px", minWidth: 200 }}>
            <h4 style={sectionTitle}>Connect With Us</h4>
            <div style={{ display: "flex", gap: 14 }}>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: text, display: "inline-flex", padding: 8, borderRadius: 10, border: `1px solid ${subtle}`, background: "rgba(255,255,255,0.02)" }}>
                <Linkedin size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: text, display: "inline-flex", padding: 8, borderRadius: 10, border: `1px solid ${subtle}`, background: "rgba(255,255,255,0.02)" }}>
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: text, display: "inline-flex", padding: 8, borderRadius: 10, border: `1px solid ${subtle}`, background: "rgba(255,255,255,0.02)" }}>
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: text, display: "inline-flex", padding: 8, borderRadius: 10, border: `1px solid ${subtle}`, background: "rgba(255,255,255,0.02)" }}>
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 13, marginTop: 12, opacity: 0.85 }}>
          © 2025 NextStep Navigator. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
