import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'

const Register = () => {
  const navigate=useNavigate()
  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
        </div>

        <form className="register-form" onSubmit={()=> navigate('/login')}>
          <div className="form-row">
            <div className="form-group">
              <label >Name</label>
              <input type="text" id="Name" className="form-input"/>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email"  id="email" className="form-input"/>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Re-Enter Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="form-input"
            />
          </div>

          <button type="submit" className="register-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register