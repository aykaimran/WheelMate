import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { useDispatch, useSelector } from 'react-redux'
import { login, selectUserError, selectIsLoggedIn, clearError } from '../Redux/userSlice'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  
  const dispatch = useDispatch()
  const error = useSelector(selectUserError)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email is required')
      return false
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    } else {
      setEmailError('')
      return true
    }
  }

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Password is required')
      return false
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return false
    } else {
      setPasswordError('')
      return true
    }
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    validateEmail(value)
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }

  useEffect(() => {
    if (isLoggedIn) {
      toast.success('Login successful!')
      navigate('/')
    }
  }, [isLoggedIn, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
      setIsSubmitting(false)
    }
  }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      toast.error('Please fix the errors in the form')
      return
    }

    if (isSubmitting) {
      toast.loading('Processing your login...')
      return
    }

    setIsSubmitting(true)
    dispatch(clearError())
    dispatch(login({ email, password }))
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <p>Log in to continue your ride-sharing journey</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your university email"
              className={`form-input ${emailError ? 'input-error' : ''}`}
              value={email}
              onChange={handleEmailChange}
              onBlur={() => validateEmail(email)}
              disabled={isSubmitting}
              required
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className={`form-input ${passwordError ? 'input-error' : ''}`}
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              disabled={isSubmitting}
              required
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login