import React from 'react'
import { Link } from 'react-router-dom'

export default function DashboardSidebar() {
  return (
    <div
      style={{
        width: '220px',
        background: '#fff',
        borderRight: '1px solid #eee',
        minHeight: '100vh',
        padding: '24px 0',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '24px', textAlign: 'center', color: '#2d3436' }}>
        Menu
      </div>
      <Link to="/" style={{ padding: '12px 32px', color: '#2d3436', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
      <Link to="careers" style={{ padding: '12px 32px', color: '#2d3436', textDecoration: 'none', fontWeight: '500' }}>Careers</Link>
      <Link to="resources" style={{ padding: '12px 32px', color: '#2d3436', textDecoration: 'none', fontWeight: '500' }}>Resources</Link>
      <Link to="analytics" style={{ padding: '12px 32px', color: '#2d3436', textDecoration: 'none', fontWeight: '500' }}>Analytics</Link>
      <Link to="settings" style={{ padding: '12px 32px', color: '#2d3436', textDecoration: 'none', fontWeight: '500' }}>Settings</Link>
    </div>
  )
}