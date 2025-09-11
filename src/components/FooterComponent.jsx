import React from "react";
import { Link } from "react-router-dom";
// import "./FooterComponent.css";

export default function FooterComponent() {
  return (
    <footer style={{ backgroundColor: '#2d3748', color: '#e2e8f0', padding: '2rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '2rem', flexWrap: 'wrap', paddingBottom: '1rem', borderBottom: '1px solid #4a5568' }}>
        {/* About Section */}
        <div style={{ flex: '1 1 200px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <svg
              style={{ width: '2rem', height: '2rem', color: '#63b3ed' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.75 17L9 20l-1 1h6l-1-1-1.25-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>NextStep Navigator</h3>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>Guiding your career journey with expert insights and comprehensive resources.</p>
        </div>

        {/* Quick Links */}
        <div style={{ flex: '1 1 150px', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0', fontSize: '0.875rem' }}>
            <li style={{ marginBottom: '0.25rem' }}><Link to="/" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Home</Link></li>
            <li style={{ marginBottom: '0.25rem' }}><Link to="/career-bank" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Career Bank</Link></li>
            <li style={{ marginBottom: '0.25rem' }}><Link to="/interest-quiz" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Interest Quiz</Link></li>
            <li style={{ marginBottom: '0.25rem' }}><Link to="/resources" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Resources</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div style={{ flex: '1 1 150px', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Support</h4>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0', fontSize: '0.875rem' }}>
            <li style={{ marginBottom: '0.25rem' }}><Link to="/help-center" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Help Center</Link></li>
            <li style={{ marginBottom: '0.25rem' }}><Link to="/faqs" style={{ color: '#e2e8f0', textDecoration: 'none' }}>FAQs</Link></li>
            <li style={{ marginBottom: '0.25rem' }}><Link to="/contact" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Contact Us</Link></li>
            <li style={{ marginBottom: '0.25rem' }}><Link to="/privacy-policy" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div style={{ flex: '1 1 150px', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Connect With Us</h4>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#e2e8f0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#e2e8f0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.799-1.574 2.16-2.72-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.103 0-5.619 2.516-5.619 5.621 0 .444.05.871.138 1.284-4.671-.237-8.835-2.474-11.604-5.891-.482.82-.759 1.764-.759 2.771 0 1.948.995 3.668 2.502 4.676-.922-.029-1.796-.283-2.556-.706v.074c0 2.721 1.939 4.975 4.512 5.51-.472.129-.976.195-1.492.195-.36 0-.71-.035-1.05-.1.722 2.222 2.81 3.84 5.295 3.882-1.928 1.51-4.368 2.417-7.039 2.417-.456 0-.905-.027-1.349-.078 2.484 1.597 5.432 2.532 8.572 2.532 10.286 0 15.908-8.525 15.908-15.91 0-.243-.005-.486-.014-.728.981-.715 1.834-1.608 2.511-2.617z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#e2e8f0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.996c0-1.021.064-2.004 2.016-2.004h1.984v-3h-3.192c-3.31 0-4.808 1.652-4.808 4.615v3.385z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#e2e8f0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.981 4.981.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.252-1.691 4.771-4.981 4.981-1.265.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.981-4.981-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.148-3.252 1.691-4.771 4.981-4.981 1.265-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.668.014-4.949.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.692-.073 4.949s.014 3.668.072 4.949c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.692.073 4.949.073s3.668-.014 4.949-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.281.073-1.692.073-4.949s-.014-3.668-.072-4.949c-.198-4.357-2.618-6.782-6.979-6.98-1.281-.059-1.692-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163c3.403 0 6.162-2.759 6.162-6.163s-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1rem' }}>
        © 2025 NextStep Navigator. All rights reserved.
      </div>
    </footer>
  );
}
