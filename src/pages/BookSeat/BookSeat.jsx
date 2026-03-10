import React, { useState } from 'react'
import './BookSeat.css'
import { Link } from 'react-router-dom'

const BookSeat = () => {
  const [showMessage, setShowMessage] = useState(false)

  const handleBooking = () => {
    setShowMessage(true)
    setTimeout(() => setShowMessage(false), 3000)
  }

  return (
    <div className="book-container">
      <h2>Book Your Seat</h2>
      {/* hardcoded ride details for now, will be dynamic later based on the ride selected from available rides page */}
      <div className="ride-summary">
        <h3>Ride Details</h3>
        <p><strong>Driver:</strong> Ali Raza</p>
        <p><strong>From:</strong> Gulshan Campus</p>
        <p><strong>To:</strong> DHA Phase 6</p>
        <p><strong>Time:</strong> 8:30 AM</p>
        <p><strong>Available Seats:</strong> 3</p>
      </div>

      <div className="booking-section">
        <p>How many seats would you like to book?</p>
        {/* hardcoded for now*/}
        <select className="seat-select"> 
          <option>1 seat</option>
          <option>2 seats</option>
          <option>3 seats</option>
        </select>

        <button onClick={handleBooking} className="book-btn-new">
          Confirm Booking
        </button>
        <div className="actions">
          <Link to="/availablerides" className="secondary-btn">Back</Link>
        </div>
      </div>

      {showMessage && (
        <div className="success-message">
          ✓ Done! You owe the driver chai now
        </div>
      )}
    </div>
  )
}

export default BookSeat