
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Register from './pages/Register/Register'
import PostRides from './pages/Postrides/Postrides'
import RequestRide from './pages/RequestRide/RequestRide'
import ViewDetails from './pages/RideDetail/ViewDetails'
import AvailableRides from './pages/AvailableRides/AvailableRides'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import MyBookings from './pages/MyBookings/MyBookings'
import BookSeat from './pages/BookSeat/BookSeat'
import { Toaster } from 'react-hot-toast'
function App() {

  return (
    <>
    <BrowserRouter>
      <Navbar />
      <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#2c7a7b',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#b22234',
              },
            },
          }}
        />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/postrides" element={<PostRides />} />
        <Route path="/requestride" element={<RequestRide />} />
        <Route path="/viewdetails/:id" element={<ViewDetails />} />
        <Route path="/availablerides" element={<AvailableRides />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/bookseat/:id" element={<BookSeat />} />


      </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App
