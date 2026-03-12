import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectIsLoggedIn } from '../pages/Redux/userSlice'
import './Navbar.css'
import toast from 'react-hot-toast'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully!')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" style={{ textDecoration: 'none', color: '#f6e05e' }}> WheelMate</Link>
        </div>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/availablerides" className="nav-link">Available Rides</Link>
          {isLoggedIn && (
            <>
              <Link to="/requestride" className="nav-link">Request Ride</Link>
              <Link to="/mybookings" className="nav-link">My Bookings</Link>
              <Link to="/changepassword" className="nav-link">Change Password</Link>
            </>
          )}
          
          <div className="auth-section">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="login-btn">Login</Link>
                <Link to="/register" className="register-btn">Register</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="logout-btn" style={{ border: 'none', cursor: 'pointer' }}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar