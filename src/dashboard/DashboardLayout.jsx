import React from 'react'
import DashboardNavbar from '../components/dashboardComponents/DashboardNavbar'
import DashboardSidebar from '../components/dashboardComponents/DashboardSidebar'
import FooterComponent from '../components/FooterComponent'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DashboardNavbar />
      <div
        className="main-content"
        style={{
          flex: 1,
          display: 'flex',
          background: '#f5f6fa'
        }}
      >
        <DashboardSidebar
          style={{
            width: '220px',
            background: '#fff',
            borderRight: '1px solid #eee',
            minHeight: '100%'
          }}
        />
        <div
          className="content"
          style={{
            flex: 1,
            padding: '32px',
            background: '#f5f6fa'
          }}
        >
          <Outlet />
        </div>
      </div>
      <FooterComponent />
    </div>
  )
}