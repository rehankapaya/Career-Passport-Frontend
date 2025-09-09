import React from 'react'
import { Outlet } from 'react-router-dom'
import NavbarComponent from '../components/NavbarComponent'
import FooterComponent from '../components/FooterComponent'

export default function AppLayout() {
  return (
    <div>
      <NavbarComponent />
      <Outlet />
      <FooterComponent />
    </div>
  )
}
