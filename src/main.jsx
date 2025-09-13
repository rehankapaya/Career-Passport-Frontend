import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserProvider from './context/UserContext.jsx'
import { ToastContainer } from 'react-toastify'
import "@fortawesome/fontawesome-free/css/all.min.css";
import CareerProvider from './context/CareerContext.jsx'


createRoot(document.getElementById('root')).render(
  <UserProvider>
    <CareerProvider>
    <App />
    <ToastContainer/>
  </CareerProvider>
  </UserProvider>,
)
