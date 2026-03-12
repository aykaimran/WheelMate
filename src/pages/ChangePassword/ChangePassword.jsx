import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  changepassword,
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    dispatch(changepassword({
      email: currentUser.email,
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword
    }))
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
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
      setTimeout(() => {
        navigate('/')
      }, 2000)
    }
  }, [passwordChangeSuccess, navigate])


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
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" name="newPassword" placeholder="Enter new password"
              className="form-input" value={formData.newPassword} onChange={handleChange} required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword"
              placeholder="Re-enter new password" className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange} required
            />
          </div>

          <p className="requirements-title">
            Password must contain at least 8 characters
          </p>

          <button type="submit" className="update-btn">
            Update Password
          </button>
        </form>

        <div className="actions" style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            className="secondary-btn"
            style={{
              background: 'transparent',
              border: '2px solid #2c7a7b',
              color: '#2c7a7b',
              padding: '8px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
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