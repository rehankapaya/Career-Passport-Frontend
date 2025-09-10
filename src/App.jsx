import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import HomePage from './layouts/pages/HomePage'
import AboutPage from './layouts/pages/AboutPage'
import ContactPage from './layouts/pages/ContactPage'
import DashboardLayout from './dashboard/DashboardLayout'
import { useContext } from 'react'
import { UserContext } from './context/UserContext'
import SignupPage from './auth/SignupPage'
import LoginPage from './auth/LoginPage'
import AdminLoginPage from './auth/AdminLoginPage'
import UserProfilePage from './layouts/pages/UserProfilePage'
import ServicesPages from './layouts/pages/ServicesPage'
import SuccessStoriesPage from './layouts/pages/SuccessStoriesPage'


export default function App() {
  const { user } = useContext(UserContext)
  const router = createBrowserRouter([
    {
      path: '/signup',
      element: <SignupPage />
    },
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: '/user-profile',
          element: <UserProfilePage />
        },
        {
          path: '/about',
          element: <AboutPage />
        },
        {
          path: '/contact',
          element: <ContactPage />
        },
        {
          path: '/services',
          element: <ServicesPages />
        },
        {
          path: '/success-stories',
          element: <SuccessStoriesPage />
        }
      ]
    },
    {
      path: '/admin',
      element:user?.role === "admin" ?<Navigate to="/admin/dashboard" />:<AdminLoginPage />,
    },
    {
      path: '/admin/dashboard',
      element: user && user?.role === "admin" ? <DashboardLayout /> : <Navigate to="/" />,
      children: [
        { index: true, element: <h1>Admin Dashboard Home</h1>
        },
        { path: 'manage-users', element: <h1>Manage Users</h1> },
        { path: 'careers', element: <h1>Careers</h1> },
        { path: 'resources', element: <h1>Resources</h1> },
        { path: 'analytics', element: <h1>Analytics</h1> },
        { path: 'settings', element: <h1>Settings</h1> }
      ]
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}