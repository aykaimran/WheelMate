import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
        <nav className="navbar">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/">Dashboard</Link>
          <Link to="/postrides">Post Rides</Link>
          <Link to="/requestride">Request Ride</Link>
          <Link to="/viewdetails">View Details</Link>
          <Link to="/availablerides">Available Rides</Link>
          <Link to="/changepassword">Change Password</Link>
          <Link to="/mybookings">My Bookings</Link>

        </nav>
    
  )
}

export default Navbar
