import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import './Login.css'
import { useDispatch, useSelector } from 'react-redux'
import { login, selectUserError, selectIsLoggedIn, clearError } from '../Redux/userSlice'
import toast from 'react-hot-toast'
const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const error = useSelector(selectUserError)
  const isLoggedIn = useSelector(selectIsLoggedIn)
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
    }
  }, [error, dispatch])

  function handleSubmit(e) {

    e.preventDefault()
    dispatch(clearError())
    dispatch(login({ email, password }))

  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back!!!!</h2>
          <p>Log in to continue your ride-sharing journey</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your university email" className="form-input"
              onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" className="form-input"
              onChange={(e) => setPassword(e.target.value)} />
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