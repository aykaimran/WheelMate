import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom' 
import { useDispatch, useSelector } from 'react-redux'
import { selectRideById } from '../Redux/rideSlice' 
import './ViewDetails.css'

const ViewDetails = () => {
  const { id } = useParams() 
  const dispatch = useDispatch()
    const ride = useSelector(selectRideById(id))
  
  if (!ride) {
    return (
      <div className="details-container">
        <div className="details-card">
          <h2>Ride Not Found</h2>
          <p>The ride you're looking for doesn't exist.</p>
          <Link to="/availablerides" className="secondary-btn">Back to Rides</Link>
        </div>
      </div>
    )
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
          <p><strong>Date:</strong> {ride.date}</p>
          <p><strong>Vehicle:</strong> {ride.vehicle}</p>
          <p><strong>Seats:</strong> {ride.availableSeats} left</p>
          <p><strong>Price:</strong> {ride.price}</p>
          <p><strong>Contact:</strong> {ride.contact || "Not provided"}</p>
          
          {ride.notes && (
            <div className="notes">
              <p><strong>Notes:</strong> {ride.notes}</p>
            </div>
          )}

          <div className="driver-bio">
            <p><strong>About Driver:</strong>{ride.driverBio || "No bio available"}</p>
          </div>
        </div>

        <div className="actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <Link to="/availablerides" className="secondary-btn">← Back to Rides</Link>
          <Link to={`/bookseat/${ride.id}`} className="primary-btn">Book This Ride</Link>
        </div>
      </div>
    </div>
  )
}

export default ViewDetails