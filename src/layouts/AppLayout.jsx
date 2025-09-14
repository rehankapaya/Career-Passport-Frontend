import React from 'react'
import { Outlet } from 'react-router-dom'
import NavbarComponent from '../components/NavbarComponent'
import FooterComponent from '../components/FooterComponent'
import SiteMapPage from './pages/SiteMapPage'

export default function AppLayout() {
  return (
    <div>
      <NavbarComponent />
      <Outlet />
      <SiteMapPage/>
      <FooterComponent />
    </div>
  )
}
