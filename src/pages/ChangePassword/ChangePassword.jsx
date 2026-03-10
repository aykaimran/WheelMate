import React from 'react'
import './ChangePassword.css'

const ChangePassword = () => {
  return (
    <div className="password-container">
      <div className="password-card">
        <div className="password-header">
          <h2>Change Password</h2>
          <p>Update your account password</p>
        </div>

        <form className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input 
              type="password" 
              id="currentPassword" 
              placeholder="Enter current password"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input 
              type="password" 
              id="newPassword" 
              placeholder="Enter new password"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              placeholder="Re-enter new password"
              className="form-input"
            />
          </div>

            <p className="requirements-title">Password must contain at least 8 characters</p>

          <button type="submit" className="update-btn">
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword