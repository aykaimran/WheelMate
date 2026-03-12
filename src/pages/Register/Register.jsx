import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, selectUserError, clearError } from '../Redux/userSlice'
import './Register.css'
import toast from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const error = useSelector(selectUserError)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')

  useEffect(() => {
    const password = formData.password
    if (!password) {
      setPasswordStrength('')
      return
    }

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const lengthValid = password.length >= 8

    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, lengthValid]
    const strongCount = strength.filter(Boolean).length

    if (strongCount >= 5) setPasswordStrength('strong')
    else if (strongCount >= 3) setPasswordStrength('medium')
    else setPasswordStrength('weak')
  }, [formData.password])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
      setIsSubmitting(false)
    }
  }, [error, dispatch])

  const validateName = (name) => {
    if (!name) return 'Name is required'
    if (name.length < 2) return 'Name must be at least 2 characters'
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces'
    return ''
  }

  const validateEmail = (email) => {
    if (!email) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return ''
  }

  const validatePassword = (password) => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter'
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter'
    if (!hasNumbers) return 'Password must contain at least one number'
    
    return ''
  }

  const validateConfirmPassword = (confirm) => {
    if (!confirm) return 'Please confirm your password'
    if (confirm !== formData.password) return 'Passwords do not match'
    return ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    let error = ''
    switch(name) {
      case 'name':
        error = validateName(value)
        break
      case 'email':
        error = validateEmail(value)
        break
      case 'password':
        error = validatePassword(value)
        if (formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(formData.confirmPassword)
          }))
        }
        break
      case 'confirmPassword':
        error = validateConfirmPassword(value)
        break
      default:
        break
    }
    setErrors({ ...errors, [name]: error })
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    let error = ''
    switch(name) {
      case 'name':
        error = validateName(value)
        break
      case 'email':
        error = validateEmail(value)
        break
      case 'password':
        error = validatePassword(value)
        break
      case 'confirmPassword':
        error = validateConfirmPassword(value)
        break
      default:
        break
    }
    setErrors({ ...errors, [name]: error })
  }

  const validateForm = () => {
    const nameError = validateName(formData.name)
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    const confirmError = validateConfirmPassword(formData.confirmPassword)

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmError
    })

    return !nameError && !emailError && !passwordError && !confirmError
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    if (isSubmitting) {
      toast.loading('Creating your account...')
      return
    }

    setIsSubmitting(true)
    dispatch(clearError())
    dispatch(registerUser({ 
      email: formData.email, 
      password: formData.password, 
      name: formData.name.trim() 
    }))

    setTimeout(() => {
      if (!error) {
        toast.success('Registration successful! Please log in.')
        navigate('/login')
      }
      setIsSubmitting(false)
    }, 1500)
  }

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 'strong': return '#4caf50'
      case 'medium': return '#ff9800'
      case 'weak': return '#f44336'
      default: return '#64748b'
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join the WheelMate community</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="Enter your full name" value={formData.name}
              onChange={handleChange} onBlur={handleBlur} required disabled={isSubmitting} />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email"  name="email" className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="student@university.edu" value={formData.email}
              onChange={handleChange} onBlur={handleBlur} required
              disabled={isSubmitting} />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password"  name="password" className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="Create a password" value={formData.password}
              onChange={handleChange} onBlur={handleBlur}  required
              disabled={isSubmitting} />
            {formData.password && (
              <div style={{ marginTop: '5px' }}>
                <div style={{
                  height: '4px',
                  width: '100%',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '2px'
                }}>
                  <div style={{
                    height: '4px',
                    width: passwordStrength === 'strong' ? '100%' : passwordStrength === 'medium' ? '66%' : '33%',
                    backgroundColor: getPasswordStrengthColor(),
                    borderRadius: '2px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ color: getPasswordStrengthColor(), fontSize: '12px', marginTop: '2px' }}>
                  Password strength: {passwordStrength || 'Not entered'}
                </p>
              </div>
            )}
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input  type="password"  name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="Re-enter password"
              value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
              required disabled={isSubmitting} />
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          </div>

          <div className="password-requirements" style={{ 
            background: '#f8fafc', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#0f4c5c', fontWeight: 600, marginBottom: '8px' }}>
              Password must contain:
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ 
                color: formData.password.length >= 8 ? '#4caf50' : '#f44336',
                marginBottom: '4px',
                fontSize: '13px'
              }}>
                ✓ At least 8 characters
              </li>
              <li style={{ 
                color: /[A-Z]/.test(formData.password) ? '#4caf50' : '#f44336',
                marginBottom: '4px',
                fontSize: '13px'
              }}>
                ✓ At least one uppercase letter
              </li>
              <li style={{ 
                color: /[a-z]/.test(formData.password) ? '#4caf50' : '#f44336',
                marginBottom: '4px',
                fontSize: '13px'
              }}>
                ✓ At least one lowercase letter
              </li>
              <li style={{ 
                color: /\d/.test(formData.password) ? '#4caf50' : '#f44336',
                marginBottom: '4px',
                fontSize: '13px'
              }}>
                ✓ At least one number
              </li>
            </ul>
          </div>

          <button 
            type="submit" 
            className="register-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="register-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register