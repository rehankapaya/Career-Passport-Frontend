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
import ForgotPasswordPage from './auth/ForgotPasswordPage'
import UserProfilePage from './layouts/pages/UserProfilePage'
import ServicesPages from './layouts/pages/ServicesPage'
import SuccessStoriesPage from './layouts/pages/SuccessStoriesPage'
import AdminSuccessStoriesPage from './dashboard/dashboardPages/AdminSuccessStoriesPage'
import MultimediaPage from './layouts/pages/MultiMediaPage'
import AdminMultimediaPage from './dashboard/dashboardPages/AdminMultimediaPage'
import MultimediaDetailPage from './layouts/pages/MultimediaDetailPage'
import ResourcesPage from './layouts/pages/ResourcesPage'
import CareerBankPage from './layouts/pages/CareerBankPage'
import InterestQuizPage from './layouts/pages/InterestQuizPage'
import BookMarkpage from './layouts/pages/BookMarkpage'
import FeedbackForm from './layouts/pages/FeedBackForm'
import ResourceDetailsPage from './layouts/pages/ResourceDetailPage'
import AdminAddResourcePage from './dashboard/dashboardPages/AdminAddResourcePage'
import AdminFeedbackPage from './dashboard/dashboardPages/AdminFeedbackPage'


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
      path:'/password-reset',
      element:<ForgotPasswordPage/>
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
          path: '/profile',
          element: <UserProfilePage />
        },
        {
          path:"/multimedia",
          element:<MultimediaPage/>
        },
        {
          path: '/multimedia/:id',
          element: <MultimediaDetailPage />
        },
        {
          path: '/resources',
          element: <ResourcesPage />
        },
        {
          path: '/resources/:id',
          element: <ResourceDetailsPage />
        },
        {
          path: '/about',
          element: <AboutPage />
        },
        {
          path: '/feedback',
          element: <FeedbackForm />
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
        },
        {
          path: '/career-bank',
          element: <CareerBankPage />
        },
        {
          path: '/interest-quiz',
          element: <InterestQuizPage />
        },
        {
          path: '/my-bookmarks',
          element: user?<BookMarkpage />:<Navigate to={"/login"}/>,
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
        { path: 'addresource', element: <AdminAddResourcePage /> },
        { path: 'adminmultimedia', element: <AdminMultimediaPage/> },
        { path: 'adminsuccessstories', element: <AdminSuccessStoriesPage/> },
        { path: 'adminfeedback', element: <AdminFeedbackPage/> },
        { path: 'analytics', element: <h1>Analytics</h1> },
        { path: 'settings', element: <h1>Settings</h1> }
      ]
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}