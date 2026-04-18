import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  changePassword,
  selectCurrentUser,
  selectUserError,
  selectPasswordChangeSuccess,
  clearError
} from '../Redux/userSlice'
import toast from 'react-hot-toast'
import './ChangePassword.css'

const ChangePassword = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const error = useSelector(selectUserError)
  const passwordChangeSuccess = useSelector(selectPasswordChangeSuccess)

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to change password')
      navigate('/login')
    }
  }, [currentUser, navigate])

  useEffect(() => {
    const password = formData.newPassword
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
  }, [formData.newPassword])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('All fields are required')
      return false
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match')
      return false
    }
    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return false
    }
    if (formData.currentPassword === formData.newPassword) {
      toast.error('New password must be different from current password')
      return false
    }
    const hasUpperCase = /[A-Z]/.test(formData.newPassword)
    const hasLowerCase = /[a-z]/.test(formData.newPassword)
    const hasNumbers = /\d/.test(formData.newPassword)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      toast.error('Password must contain at least one uppercase letter, one lowercase letter, and one number')
      return false
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    dispatch(changePassword({
        currentPassword: formData.currentPassword, 
        newPassword: formData.newPassword
    }))
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
      setIsSubmitting(false)
    }
  }, [error, dispatch])

  useEffect(() => {
    if (passwordChangeSuccess) {
      toast.success('Password changed successfully!')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setIsSubmitting(false)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    }
  }, [passwordChangeSuccess, navigate])

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 'strong': return '#4caf50'
      case 'medium': return '#ff9800'
      case 'weak': return '#f44336'
      default: return '#64748b'
    }
  }

  return (
    <div className="password-container">
      <div className="password-card">
        <div className="password-header">
          <h2>Change Password</h2>
          <p>Update your account password</p>
        </div>

        <form className="password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              placeholder="Enter current password"
              className="form-input"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password"
              className="form-input"
              value={formData.newPassword}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
            {formData.newPassword && (
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
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter new password"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p style={{ color: '#f44336', fontSize: '12px', marginTop: '2px' }}>
                Passwords do not match
              </p>
            )}
          </div>

          <div className="requirements-list" style={{ marginTop: '10px' }}>
            <p className="requirements-title">Password must contain:</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ color: formData.newPassword.length >= 8 ? '#4caf50' : '#f44336' }}>
                ✓ At least 8 characters
              </li>
              <li style={{ color: /[A-Z]/.test(formData.newPassword) ? '#4caf50' : '#f44336' }}>
                ✓ At least one uppercase letter
              </li>
              <li style={{ color: /[a-z]/.test(formData.newPassword) ? '#4caf50' : '#f44336' }}>
                ✓ At least one lowercase letter
              </li>
              <li style={{ color: /\d/.test(formData.newPassword) ? '#4caf50' : '#f44336' }}>
                ✓ At least one number
              </li>
            </ul>
          </div>

          <button 
            type="submit" 
            className="update-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <div className="actions" style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            className="secondary-btn"
            disabled={isSubmitting}
            style={{
              background: 'transparent',
              border: '2px solid #2c7a7b',
              color: '#2c7a7b',
              padding: '8px 20px',
              borderRadius: '8px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.5 : 1
            }}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword