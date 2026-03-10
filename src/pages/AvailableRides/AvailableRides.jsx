import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AvailableRides.css'

const AvailableRides = () => {
  const rides = [
    {
      id: 1,
      driver: "Ali Raza",
      pickup: "Gulshan Campus",
      destination: "DHA Phase 6",
      time: "8:30 AM",
      seats: 3,
      vehicle: "Toyota Corolla",
      price: "Rs. 150"
    },
    {
      id: 2,
      driver: "Sara Khan",
      pickup: "Main Campus",
      destination: "North Nazimabad",
      time: "9:15 AM",
      seats: 2,
      vehicle: "Honda Civic",
      price: "Rs. 200"
    },
    {
      id: 3,
      driver: "Ahmed Malik",
      pickup: "Gulshan Campus",
      destination: "Clifton",
      time: "10:00 AM",
      seats: 4,
      vehicle: "Suzuki Swift",
      price: "Rs. 180"
    },
    {
      id: 4,
      driver: "Fatima Khan",
      pickup: "Main Campus",
      destination: "Gulistan-e-Johar",
      time: "11:30 AM",
      seats: 1,
      vehicle: "Cultus",
      price: "Rs. 120"
    }
  ]


  const navigate=useNavigate();
  return (
    <div className="rides-container">
      <div className="rides-header">
        <h2>Available Rides</h2>
        <button className="post-ride-btn" onClick={() => navigate('/postrides')}>
          Post a Ride
        </button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search by location, destination..." className="search-input"
        />
        <button className="search-btn">Search</button>
      </div>

      <div className="rides-grid">
        {rides.map((ride) => (
          <div key={ride.id} className="ride-card">
            <div className="ride-header">
              <h3 className="driver-name">{ride.driver}</h3>
              <span className="vehicle-type">{ride.vehicle}</span>
            </div>

            <div className="ride-details">
              <div className="detail-row">
                <span className="detail-label">From:</span>
                <span className="detail-value">{ride.pickup}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">To:</span>
                <span className="detail-value">{ride.destination}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time:</span>
                <span className="detail-value">{ride.time}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Seats:</span>
                <span className="detail-value seats-badge">{ride.seats} left</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Price:</span>
                <span className="detail-value price">{ride.price}</span>
              </div>
            </div>

            <div className="ride-actions">
              <Link to={`viewdetails/${ride.id}`} className="view-btn">
                View Details
              </Link>
              <button className="book-btn">Book Seat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AvailableRides