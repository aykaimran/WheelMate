import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectRideById, bookSeat  } from '../Redux/rideSlice'
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
  const [isBooking, setIsBooking] = useState(false)

  if (!id) {
    toast.error('Invalid ride ID')
    navigate('/availablerides')
    return null
  }

  if (!ride) {
    return (
      <div className="book-container">
        <h2>Ride Not Found</h2>
        <p>The ride you're trying to book doesn't exist or has been removed.</p>
        <Link to="/availablerides" className="secondary-btn">Back to Rides</Link>
      </div>
    )
  }

  if (ride.status !== 'active') {
    return (
      <div className="book-container">
        <h2>Ride Unavailable</h2>
        <p>This ride is no longer active.</p>
        <Link to="/availablerides" className="secondary-btn">Back to Rides</Link>
      </div>
    )
  }

  if (currentUser && ride.driverEmail === currentUser.email) {
    return (
      <div className="book-container">
        <h2>Cannot Book Your Own Ride</h2>
        <p>You cannot book a seat on a ride you posted.</p>
        <Link to="/availablerides" className="secondary-btn">Back to Rides</Link>
      </div>
    )
  }

  if (ride.availableSeats <= 0) {
    return (
      <div className="book-container">
        <h2>Ride Full</h2>
        <p>Sorry, this ride has no available seats left.</p>
        <Link to="/availablerides" className="secondary-btn">Back to Rides</Link>
      </div>
    )
  }

  const seatOptions = []
  for (let i = 1; i <= ride.availableSeats; i++) {
    seatOptions.push(
      <option key={i} value={i}>
        {i} seat{i > 1 ? 's' : ''}
      </option>
    )
  }

  const handleBooking = () => {
    if (!currentUser) {
      toast.error('Please login to book a seat')
      navigate('/login')
      return
    }

    if (isBooking) {
      toast.loading('Processing your booking...')
      return
    }
    const seatsToBook = parseInt(selectedSeats)
    if (isNaN(seatsToBook) || seatsToBook < 1) {
      toast.error('Please select a valid number of seats')
      return
    }

    if (seatsToBook > ride.availableSeats) {
      toast.error(`Only ${ride.availableSeats} seat(s) available`)
      return
    }

    setIsBooking(true)

    try {
      dispatch(bookSeat({
        rideId: id,
        seats: seatsToBook
    }));
      
      setShowMessage(true)
      toast.success(`${seatsToBook} seat(s) booked successfully!`)
      
      setTimeout(() => {
        setShowMessage(false)
        navigate('/mybookings')
      }, 2000)
    } catch (error) {
      toast.error('Booking failed. Please try again.')
      setIsBooking(false)
    }
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
        <p><strong>Available Seats:</strong> <span style={{color: ride.availableSeats < 3 ? '#b22234' : '#2c7a7b', fontWeight: 'bold'}}>{ride.availableSeats}</span></p>
        <p><strong>Price:</strong> {ride.price}</p>
        <p><strong>Vehicle:</strong> {ride.vehicle}</p>
      </div>

      <div className="booking-section">
        <p>How many seats would you like to book?</p>
        
        <select 
          className="seat-select"
          value={selectedSeats}
          onChange={(e) => setSelectedSeats(e.target.value)}
          disabled={isBooking}
        >
          {seatOptions}
        </select>

        <button 
          onClick={handleBooking} 
          className="book-btn"
          disabled={isBooking}
        >
          {isBooking ? 'Booking...' : 'Confirm Booking'}
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