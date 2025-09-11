import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { UserContext } from '../context/UserContext';

// The Navbar component with all styling converted to inline style attributes.
export default function NavbarComponent() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate()
  const { userlogout } = useContext(UserContext)
  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'Resources', to: '/resources' },
    { name: 'Career Bank', to: '/career-bank' },
    { name: 'Interest Quiz', to: '/interest-quiz' },
    { name: 'Multimedia Hub', to: '/multimedia' },
    { name: 'My Bookmarks', to: '/my-bookmarks' },
    { name: 'About', to: '/about' },
    { name: 'Contact', to: '/contact' },
  ];

  const activeLink = '/about';

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fff' }}>
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

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.to}
            style={{
              position: 'relative',
              color: item.to === activeLink ? '#2563eb' : '#4b5563',
              fontWeight: item.to === activeLink ? '500' : 'normal',
              textDecoration: 'none'
            }}
          >
            {item.name}
            {item.to === activeLink && (
              <span style={{ position: 'absolute', left: '0', bottom: '-8px', width: '100%', height: '2px', backgroundColor: '#2563eb', transform: 'scaleX(1)' }}></span>
            )}
            {item.to !== activeLink && (
              <span style={{ position: 'absolute', left: '0', bottom: '-8px', width: '100%', height: '2px', backgroundColor: '#2563eb', transform: 'scaleX(0)' }}></span>
            )}
          </Link>
        ))}
      </nav>

      {/* Welcome and User Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#4b5563' }}>Welcome, Alex</span>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setDropdownVisible(!isDropdownVisible)}>
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
              right: '0',
              marginTop: '0.5rem',
              width: '12rem',
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              zIndex: '10',
              opacity: isDropdownVisible ? '1' : '0',
              pointerEvents: isDropdownVisible ? 'auto' : 'none',
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            <Link to="/profile" style={{ display: 'block', padding: '0.5rem 1rem', color: '#4b5563', textDecoration: 'none' }}>Profile</Link>
            <Link to="/settings" style={{ display: 'block', padding: '0.5rem 1rem', color: '#4b5563', textDecoration: 'none' }}>Settings</Link>
            <Link onClick={() => { userlogout(), navigate('/login') }} style={{ display: 'block', padding: '0.5rem 1rem', color: '#4b5563', textDecoration: 'none' }}>Logout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}