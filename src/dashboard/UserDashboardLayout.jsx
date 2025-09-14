import React from 'react'
import { Outlet } from 'react-router-dom'
import './UserDashboardLayout.css'   // Custom CSS import
import UserSidebar from '../components/dashboardComponents/UserSidebar'
import UserTopbar from '../components/dashboardComponents/UserTopbar'

export default function DashboardLayout() {
  return (
    <div className="dashboard-container">
      {/* < UserTopbar/> */}
      <div className="dashboard-main">
        <UserSidebar />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
