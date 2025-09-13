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
import AdminCareerBankPage from './dashboard/dashboardPages/AdminCareerBankPage'
import CareerDetailPage from './layouts/pages/CareerDetailPage'
import UserDashboardLayout from './dashboard/UserDashboardLayout'
import RecentActivityPage from './layouts/pages/userdashboardpages/RecentActivityPage'
import QuizResultsPage from './layouts/pages/userdashboardpages/QuizResultsPage'
import BookmarkedItemsPage from './layouts/pages/userdashboardpages/BookmarkedItemsPage'
import RecommendedCareersPage from './layouts/pages/userdashboardpages/RecommendedCareersPage'
import RecommendedContentPage from './layouts/pages/userdashboardpages/RecommendedContentPage'
import RecommendedVideosPage from './layouts/pages/userdashboardpages/RecommendedVideosPage'
import TrendingCareersPage from './layouts/pages/userdashboardpages/TrendingCareersPage'
import TopPicksForYouPage from './layouts/pages/userdashboardpages/TopPicksForYouPage'
import QuizPage from './layouts/pages/QuizPage'
import ResultPage from './layouts/pages/ResultPage';
import HistoryPage from './layouts/pages/HistoryPage'

export default function App() {
  const { user } = useContext(UserContext)
  const router = createBrowserRouter([
    {
      path: '/signup',
      element: !user ? <SignupPage /> : <Navigate to={"/"} />,
    },
    {
      path: '/login',
      element: !user ? <LoginPage /> : <Navigate to={"/"} />,
    },
    {
      path: '/password-reset',
      element: <ForgotPasswordPage />
    },
    {
      path: '/',
      element: user?.role == "admin" ? <Navigate to={"/admin"} /> : <AppLayout />,
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
          path: "/multimedia",
          element: <MultimediaPage />
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
          path: '/career-bank/:id',
          element: <CareerDetailPage />
        },
        {
          path: '/interest-quiz',
          element: <InterestQuizPage />
        },
        {
          path: '/quiz',
          element: user ? <QuizPage /> : <Navigate to={"/login"} />,
        },
        {
          path: '/result/:attemptId',
          element: user ? <ResultPage /> : <Navigate to={"/login"} />,
        },
        {
          path: '/history',
          element: user ? <HistoryPage /> : <Navigate to={"/login"} />,
        },
        {
          path: '/user-dashboard',
          element: user && user?.role !== "admin" ? <UserDashboardLayout /> : <Navigate to="/" />,
          children: [
            {
              index: true, element: <h1>Admin Dashboard Home</h1>
            },
            { path: 'manage-users', element: <h1>Manage Users</h1> },
            { path: 'recent-activity', element: <RecentActivityPage /> },
            { path: 'quiz-result', element: <QuizResultsPage /> },
            { path: 'book-mark', element: <BookMarkpage /> },
            { path: 'recommended-career', element: <RecommendedCareersPage /> },
            { path: 'recommended-content', element: <RecommendedContentPage /> },
            { path: 'recommended-videos', element: <RecommendedVideosPage /> },
            { path: 'trending-career', element: <TrendingCareersPage /> },
            { path: 'top-pick', element: <TopPicksForYouPage /> },
            { path: 'analytics', element: <h1>Analytics</h1> },
            { path: 'settings', element: <h1>Settings</h1> }
          ]
        },
        {
          path: '/my-bookmarks',
          element: user ? <BookMarkpage /> : <Navigate to={"/login"} />,
        },
      ]
    },
    {
      path: '/admin',
      element: user?.role === "admin" ? <Navigate to="/admin/dashboard" /> : <AdminLoginPage />,
    },
    {
      path: '/admin/dashboard',
      element: user && user?.role === "admin" ? <DashboardLayout /> : <Navigate to="/" />,
      children: [
        {
          index: true, element: <h1>Admin Dashboard Home</h1>
        },
        { path: 'manage-users', element: <h1>Manage Users</h1> },
        { path: 'admincareerbank', element: <AdminCareerBankPage /> },
        { path: 'addresource', element: <AdminAddResourcePage /> },
        { path: 'adminmultimedia', element: <AdminMultimediaPage /> },
        { path: 'adminsuccessstories', element: <AdminSuccessStoriesPage /> },
        { path: 'adminfeedback', element: <AdminFeedbackPage /> },
        { path: 'analytics', element: <h1>Analytics</h1> },
        { path: 'settings', element: <h1>Settings</h1> }
      ]
    },


  ])

  return (
    <RouterProvider router={router} />
  )
}