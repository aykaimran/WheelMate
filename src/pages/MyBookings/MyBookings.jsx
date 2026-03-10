import React from 'react'
import { Link } from 'react-router-dom'
import './MyBookings.css'

const MyBookings = () => {
  const bookings = [
    {
      id: 1,
      driver: "Ali Raza",
      pickup: "Gulshan Campus",
      destination: "DHA Phase 6",
      time: "8:30 AM",
      seats: 1,
      status: "confirmed",
      date: "March 15, 2026"
    },
    {
      id: 2,
      driver: "Sara Khan",
      pickup: "Main Campus",
      destination: "North Nazimabad",
      time: "9:15 AM",
      seats: 2,
      status: "pending",
      date: "March 16, 2026"
    },
    {
      id: 3,
      driver: "Ahmed Malik",
      pickup: "Gulshan Campus",
      destination: "Clifton",
      time: "10:00 AM",
      seats: 1,
      status: "completed",
      date: "March 14, 2026"
    }
  ]

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      
      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <h3>{booking.driver}</h3>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Time:</strong> {booking.time}</p>
            <p><strong>From:</strong> {booking.pickup}</p>
            <p><strong>To:</strong> {booking.destination}</p>
            <p><strong>Seats:</strong> {booking.seats}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            
            <div className="booking-actions">
              <Link to={`/ride/${booking.id}`}>View Details</Link>
              {booking.status === 'pending' && (
                <button>Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBookings