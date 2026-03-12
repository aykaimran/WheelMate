import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectRideById, bookARide } from '../Redux/rideSlice'  // Use bookARide, not requestRide
import { selectCurrentUser } from '../Redux/userSlice'
import './BookSeat.css'
import toast from 'react-hot-toast'

const BookSeat = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const ride = useSelector(selectRideById(id))
  const currentUser = useSelector(selectCurrentUser)
  
  const [selectedSeats, setSelectedSeats] = useState('1')
  const [showMessage, setShowMessage] = useState(false)

  const seatOptions = []
  if (ride) {
    for (let i = 1; i <= ride.availableSeats; i++) {
      seatOptions.push(
        <option key={i} value={i}>
          {i} seat{i > 1 ? 's' : ''}
        </option>
      )
    }
  }

  const handleBooking = () => {
    if (!currentUser) {
      toast.error('Please login to book a seat')
      navigate('/login')
      return
    }
    dispatch(bookARide({
      rideId: id,
      useremail: currentUser.email,
      seatsRequested: parseInt(selectedSeats),
      passengerInfo: {
        name: currentUser.name,
        email: currentUser.email
      }
    }))
    
    setShowMessage(true)
    toast.success(`${selectedSeats} seat(s) booked successfully!`)
    
    setTimeout(() => {
      setShowMessage(false)
      navigate('/mybookings')
    }, 2000)
  }

  if (!ride) {
    return (
      <div className="book-container">
        <h2>Ride Not Found</h2>
        <Link to="/availablerides" className="secondary-btn">Back to Rides</Link>
      </div>
    )
  }

  return (
    <div className="book-container">
      <h2>Book Your Seat</h2>
      
      <div className="ride-summary">
        <h3>Ride Details</h3>
        <p><strong>Driver:</strong> {ride.driver}</p>
        <p><strong>From:</strong> {ride.pickup}</p>
        <p><strong>To:</strong> {ride.destination}</p>
        <p><strong>Time:</strong> {ride.time}</p>
        <p><strong>Date:</strong> {ride.date}</p>
        <p><strong>Available Seats:</strong> {ride.availableSeats}</p>
        <p><strong>Price:</strong> {ride.price}</p>
      </div>

      <div className="booking-section">
        <p>How many seats would you like to book?</p>
        
        <select 
          className="seat-select"
          value={selectedSeats}
          onChange={(e) => setSelectedSeats(e.target.value)}
        >
          {seatOptions}
        </select>

        <button onClick={handleBooking} className="book-btn">
          Confirm Booking
        </button>
        
        <div className="actions" style={{ marginTop: '15px' }}>
          <Link to={`/viewdetails/${id}`} className="secondary-btn">← Back to Details</Link>
        </div>
      </div>

      {showMessage && (
        <div className="success-message">
          Booking confirmed! Check My Bookings
        </div>
      )}
    </div>
  )
}

export default BookSeat