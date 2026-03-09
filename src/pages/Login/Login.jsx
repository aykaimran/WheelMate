import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const navigate=useNavigate()
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back!!!!</h2>
          <p>Log in to continue your ride-sharing journey</p>
        </div>

        <form className="login-form" onSubmit={()=> navigate('/')}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your university email" className="form-input"/>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password"  placeholder="Enter your password" className="form-input"/>
          </div>

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login