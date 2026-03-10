import React from 'react'
import './RequestRide.css'

const RequestRide = () => {
  return (
    <div className="request-container">
      <h2>Request a Ride</h2>
      
      <form className="request-form">
        <div className="form-group">
          <label>Pickup Location:</label>
          <input 
            type="text" 
            placeholder="e.g. Gulshan Campus"
          />
        </div>

        <div className="form-group">
          <label>Destination:</label>
          <input 
            type="text" 
            placeholder="e.g. DHA Phase 6"
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input 
            type="date" 
          />
        </div>

        <div className="form-group">
          <label>Time:</label>
          <input 
            type="time" 
          />
        </div>

        <div className="form-group">
          <label>Number of Seats:</label>
          <select>
            <option>1 seat</option>
            <option>2 seats</option>
            <option>3 seats</option>
            <option>4 seats</option>
          </select>
        </div>

        <div className="form-group">
          <label>Additional Notes:</label>
          <textarea 
            rows="3" 
            placeholder="Any specific requirements..."
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          Submit Request
        </button>
      </form>
    </div>
  )
}

export default RequestRide