import React from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from '../Redux/userSlice'

const Dashboard = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  return (
    <div className="dashboard">
      <div className="hero-section">
        <h1 className="hero-title">
          Welcome to WheelMate</h1>
        <p className="hero-subtitle">
          Because walking to FAST in this heat is a personality trait we don't want
        </p>
        
        <div className="hero-description">
          <p>
            Tired of reaching campus looking like you just survived a shower? 
            Connect with fellow students who also believe that <strong>8:30 am is a crime against humanity</strong> 
            and deserve a ride.
          </p>
        </div>

        {!isLoggedIn ? (
          <div className="cta-buttons">
            <Link to="/login" className="cta-btn cta-primary">
              Login (Your GPA depends on it)
            </Link>
            <Link to="/register" className="cta-btn cta-secondary">
              Register (It's free, just like our WiFi... wait)
            </Link>
          </div>
        ) : (
          <div className="welcome-back">
            <p>Welcome back, legend! Your seat is waiting </p>
            <Link to="/availablerides" className="cta-btn cta-primary">
              Find Rides (Before Sir drags you for attendance)
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard