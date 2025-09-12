import React, { useContext, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function NavbarComponent() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userlogout } = useContext(UserContext);

  const mainNavItems = [
    { name: 'Home', to: '/' },
    { name: 'Resources', to: '/resources' },
    { name: 'About', to: '/about' },
    { name: 'Contact', to: '/contact' },
  ];

  const resourceNavItems = [
    { name: 'Career Bank', to: '/career-bank' },
    { name: 'Interest Quiz', to: '/interest-quiz' },
    { name: 'Multimedia Hub', to: '/multimedia' },
    { name: 'My Bookmarks', to: '/my-bookmarks' },
    { name: 'Success Stories', to: '/success-stories' },
  ];

  const activeLink = location.pathname;

  return (
    <div style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#fff' }}>
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem' }}>
        {/* Logo and App Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg
            style={{ width: '2rem', height: '2rem', color: '#2563eb' }}
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
          <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>NextStep Navigator</span>
        </div>

        {/* Main Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {mainNavItems.map((item) => {
            const isActive = item.to === activeLink;
            return (
              <Link
                key={item.name}
                to={item.to}
                style={{
                  position: 'relative',
                  color: isActive ? '#2563eb' : '#4b5563',
                  fontWeight: isActive ? '500' : 'normal',
                  textDecoration: 'none'
                }}
              >
                {item.name}
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: '-8px',
                    width: '100%',
                    height: '2px',
                    backgroundColor: '#2563eb',
                    transform: `scaleX(${isActive ? 1 : 0})`,
                    transformOrigin: 'left',
                    transition: 'transform 150ms ease'
                  }}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right side: If user -> Welcome + dropdown; else -> Login/Sign up */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#4b5563' }}>
              Welcome{user.name ? `, ${user.name}` : user.email ? `, ${user.email}` : '' }
            </span>

            <div
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => setDropdownVisible(!isDropdownVisible)}
            >
              <svg
                style={{ width: '2rem', height: '2rem', color: '#6b7280' }}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0010 16a5.979 5.979 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>

              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '12rem',
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                  zIndex: 10,
                  opacity: isDropdownVisible ? 1 : 0,
                  pointerEvents: isDropdownVisible ? 'auto' : 'none',
                  transition: 'opacity 0.2s ease-in-out'
                }}
              >
                <Link to="/profile" style={{ display: 'block', padding: '0.5rem 1rem', color: '#4b5563', textDecoration: 'none' }}>Profile</Link>
                <Link to="/settings" style={{ display: 'block', padding: '0.5rem 1rem', color: '#4b5563', textDecoration: 'none' }}>Settings</Link>
                <button
                  onClick={() => { userlogout(); navigate('/login'); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.5rem 1rem',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: '#4b5563',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/login"
              style={{
                padding: '0.5rem 0.9rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                color: '#374151',
                textDecoration: 'none'
              }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '0.375rem',
                backgroundColor: '#2563eb',
                color: '#fff',
                textDecoration: 'none'
              }}
            >
              Sign up
            </Link>
          </div>
        )}
      </div>

      {/* Resource Navigation Bar with Divider */}
      <div style={{ borderTop: '1px solid #e5e7eb', padding: '0.75rem 2rem' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'center' }}>
          {resourceNavItems.map((item) => {
            const isActive = item.to === activeLink;
            return (
              <Link
                key={item.name}
                to={item.to}
                style={{
                  position: 'relative',
                  color: isActive ? '#2563eb' : '#4b5563',
                  fontWeight: isActive ? '500' : 'normal',
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}
              >
                {item.name}
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: '-6px',
                    width: '100%',
                    height: '2px',
                    backgroundColor: '#2563eb',
                    transform: `scaleX(${isActive ? 1 : 0})`,
                    transformOrigin: 'left',
                    transition: 'transform 150ms ease'
                  }}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}