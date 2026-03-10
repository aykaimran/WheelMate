import React from 'react'
import { Link } from 'react-router-dom'
import './ViewDetails.css'

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
    notes: "AC will be on. Usually leave by 8:15 AM sharp",
    driverBio: "Final year CS student. Likes driving and good conversation."
  }

  return (
    <div className="details-container">
      <div className="details-card">
        <h2>Ride Details</h2>

        <div className="ride-info">
          <p><strong>Driver:</strong> {ride.driver}</p>
          <p><strong>From:</strong> {ride.pickup}</p>
          <p><strong>To:</strong> {ride.destination}</p>
          <p><strong>Time:</strong> {ride.time}</p>
          <p><strong>Vehicle:</strong> {ride.vehicle}</p>
          <p><strong>Seats:</strong> {ride.seats} left</p>
          <p><strong>Contact:</strong> {ride.contact}</p>
          
          <div className="notes">
            <p><strong>Notes:</strong> {ride.notes}</p>
          </div>

          <div className="driver-bio">
            <p><strong>About Driver:</strong> {ride.driverBio}</p>
          </div>
        </div>

        <div className="actions">
          <Link to="/availablerides" className="secondary-btn">Back</Link>
        </div>
      </div>
    </div>
  )
}

export default ViewDetails