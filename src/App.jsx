
import './App.css'
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
        <Route path="/viewdetails/:id" element={<ViewDetails />} />
        <Route path="/availablerides" element={<AvailableRides />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/bookseat" element={<BookSeat />} />


      </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App
