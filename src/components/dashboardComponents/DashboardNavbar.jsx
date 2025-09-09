import React from 'react'

export default function DashboardNavbar() {
  return (
    <nav
      style={{
        width: '100%',
        height: '60px',
        background: '#2d3436',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        boxSizing: 'border-box',
        fontWeight: 'bold',
        fontSize: '18px',
        letterSpacing: '1px'
      }}
    >
      <div>Career Passport Dashboard</div>
      <div>
        {/* Example user info or actions */}
        <span style={{ marginRight: '16px' }}>Welcome, User</span>
        <button
          style={{
            background: '#636e72',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}