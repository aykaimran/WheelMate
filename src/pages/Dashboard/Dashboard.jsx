// import React from 'react'

// const Dashboard = () => {
//   return (
//     <div>
//         <p>Welcome to the Dashboard!</p>
      
//     </div>
//   )
// }

// export default Dashboard



import React from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
  // You can replace this with actual auth state from Redux later
  const isLoggedIn = false; // This will come from your Redux store

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          Welcome to <span className="highlight">WheelMate</span>
        </h1>
        <p className="hero-subtitle">
          Your Campus Ride-Sharing Companion
        </p>
        
        <div className="hero-description">
          <p>
            Connect with fellow students for safe, convenient, and 
            eco-friendly transportation around campus and beyond.
          </p>
        </div>

        {!isLoggedIn ? (
          <div className="cta-buttons">
            <Link to="/login" className="cta-btn cta-primary">
              <span className="btn-icon">🔑</span>
              Login to Your Account
            </Link>
            <Link to="/register" className="cta-btn cta-secondary">
              <span className="btn-icon">📝</span>
              Create New Account
            </Link>
          </div>
        ) : (
          <div className="welcome-back">
            <p>Glad to see you back! 🎉</p>
            <Link to="/availablerides" className="cta-btn cta-primary">
              Find Available Rides
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="features-title">Why Join WheelMate?</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚗</div>
            <h3 className="feature-title">Offer Rides</h3>
            <p className="feature-description">
            Share your commute and help fellow students reach their destination
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Request Rides</h3>
            <p className="feature-description">
              Find available rides going your way with just a few clicks
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3 className="feature-title">Search & Filter</h3>
            <p className="feature-description">
              Easily find rides based on location, time, and preferences
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">Campus Community</h3>
            <p className="feature-description">
              Connect with verified students from your university
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3 className="step-title">Create Account</h3>
            <p className="step-description">
              Sign up with your university email to get started
            </p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3 className="step-title">Post or Find Rides</h3>
            <p className="step-description">
              Offer a ride if you're driving, or request one if you need a lift
            </p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3 className="step-title">Book & Travel</h3>
            <p className="step-description">
              Book your seat and connect with your ride mate
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      {!isLoggedIn && (
        <div className="cta-banner">
          <div className="banner-content">
            <h3>Ready to start your journey?</h3>
            <p>Join WheelMate today and make your campus commute easier!</p>
            <div className="banner-buttons">
              <Link to="/register" className="banner-btn banner-register">
                Register Now
              </Link>
              <Link to="/login" className="banner-btn banner-login">
                I Already Have an Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard