import React from 'react'
import { Outlet } from 'react-router-dom'
import './DashboardLayout.css'   // Custom CSS import
import DashboardNavbar from '../components/dashboardComponents/DashboardNavbar'
import DashboardSidebar from '../components/dashboardComponents/DashboardSidebar'

export default function DashboardLayout() {
  return (
    <div className="dashboard-container">
      < DashboardNavbar/>
      <div className="dashboard-main">
        <DashboardSidebar />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
