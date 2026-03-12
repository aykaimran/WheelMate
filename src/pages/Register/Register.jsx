import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, selectUserError, clearError } from '../Redux/userSlice'
import './Register.css'
import toast from 'react-hot-toast'
const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const error = useSelector(selectUserError)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (confirmPassword !== password) {
      toast.error('Passwords do not match')
      return
    }

    dispatch(clearError())
    dispatch(registerUser({ email, password, name }))

    setTimeout(() => {
      toast.success('Registration successful! Please log in.')
      navigate('/login')
    }, 100)
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label >Name</label>
              <input type="text" id="Name" className="form-input" onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" className="form-input" onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="form-input"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Re-Enter Password</label>
            <input type="password" id="confirmPassword" className="form-input"
              onChange={(e) => setConfirmPassword(e.target.value)}
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