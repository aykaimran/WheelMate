import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/login'
import Dashboard from './pages/Dashboard'
import Register from './pages/register'
import PostRides from './pages/Postrides'
import RequestRide from './pages/RequestRide'
import ViewDetails from './pages/ViewDetails'
import AvailableRides from './pages/AvailableRides'
import ChangePassword from './pages/ChangePassword'
import MyBookings from './pages/MyBookings'
function App() {

  return (
    <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/postrides" element={<PostRides />} />
        <Route path="/requestride" element={<RequestRide />} />
        <Route path="/viewdetails" element={<ViewDetails />} />
        <Route path="/availablerides" element={<AvailableRides />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/mybookings" element={<MyBookings />} />


      </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App
