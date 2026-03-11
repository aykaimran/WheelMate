import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          WheelMate
        </div>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/availablerides" className="nav-link">Available Rides</Link>
          <Link to="/requestride" className="nav-link">Request Ride</Link>
          <Link to="/mybookings" className="nav-link">My Bookings</Link>
          <Link to="/changepassword" className="nav-link">Change Password</Link>
          <div className="auth-section">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
            <Link to="/login" className="logout-btn">Logout</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar