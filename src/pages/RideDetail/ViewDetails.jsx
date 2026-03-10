import React from 'react'
import { Link } from 'react-router-dom'
import './ViewDetails.css'
 
// not correct
const ViewDetails = () => {
  const ride = {
    id: 1,
    driver: "Ali Raza",
    pickup: "Gulshan Campus",
    destination: "DHA Phase 6",
    time: "8:30 AM",
    seats: 3,
    vehicle: "Toyota Corolla",
    contact: "0333-1234567",
    notes: "AC will be on. Usually leave by 8:15 AM sharp. Don't be late!",
    driverBio: "Final year CS student. Likes driving and good conversation."
  }

  return (
    <div className="details-container">
      <div className="details-card">
        <div className="details-header">
          <h2>Ride Details</h2>
          <Link to="/availablerides" className="back-link">← Back to Rides</Link>
        </div>

        <div className="ride-info">
          <div className="info-row">
            <span className="info-label">Driver:</span>
            <span className="info-value driver-name">{ride.driver}</span>
          </div>

          <div className="info-row">
            <span className="info-label">From:</span>
            <span className="info-value">{ride.pickup}</span>
          </div>

          <div className="info-row">
            <span className="info-label">To:</span>
            <span className="info-value">{ride.destination}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Departure:</span>
            <span className="info-value time-badge">{ride.time}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Vehicle:</span>
            <span className="info-value vehicle-badge">{ride.vehicle}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Available Seats:</span>
            <span className="info-value seats-badge">{ride.seats} seats left</span>
          </div>

          <div className="info-row">
            <span className="info-label">Contact:</span>
            <span className="info-value contact">{ride.contact}</span>
          </div>

          <div className="notes-section">
            <span className="info-label">Notes:</span>
            <p className="notes-text">{ride.notes}</p>
          </div>
        </div>

        <div className="driver-profile">
          <h3>About the Driver</h3>
          <p>{ride.driverBio}</p>
        </div>

        <div className="details-actions">
          <Link to="/availablerides" className="secondary-btn">
            ← Other Rides
          </Link>
          <button className="primary-btn">
            Book This Ride
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewDetails