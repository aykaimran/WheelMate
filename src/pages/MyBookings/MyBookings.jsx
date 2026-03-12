import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectuserbookings, getuserbookings, cancelBooking } from '../Redux/rideSlice'
import { selectCurrentUser } from '../Redux/userSlice'
import toast from 'react-hot-toast'
import './MyBookings.css'

const MyBookings = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const bookings = useSelector(selectuserbookings)
  const [showContact, setShowContact] = useState(null)

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to view your bookings')
      navigate('/login')
      return
    }

    dispatch(getuserbookings(currentUser.email))
  }, [currentUser, dispatch, navigate])

  const handleCancelBooking = (bookingId, rideId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      dispatch(cancelBooking({ bookingId, rideId }))
      toast.success('Booking cancelled successfully')
      dispatch(getuserbookings(currentUser.email))
    }
  }

  const handleContactDriver = (contact) => {
    setShowContact(contact)
    setTimeout(() => setShowContact(null), 5000)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed'
      case 'pending': return 'status-pending'
      case 'completed': return 'status-completed'
      case 'cancelled': return 'status-cancelled'
      default: return ''
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return ' Confirmed'
      case 'pending': return 'Pending Approval'
      case 'completed': return ' Completed'
      case 'cancelled': return ' Cancelled'
      default: return status
    }
  }

  if (!currentUser) {
    return (
      <div className="bookings-container">
        <h2>My Bookings</h2>
        <p>Please login to view your bookings</p>
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    )
  }

  return (
    <div className="bookings-container">
      <h2>My Bookings & Requests</h2>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You haven't made any bookings or requests yet</p>
          <Link to="/availablerides" className="browse-btn">
            Browse Available Rides
          </Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const rideDetails = booking.rideDetails || {}
            const contactNumber = rideDetails.contact || booking.contact

            return (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>{rideDetails.driver || 'Driver'}</h3>
                  <span className={`booking-status ${getStatusClass(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>

                <div className="booking-details">
                  {booking.type === 'ride-request' ? (
                    <>
                      <p><strong>From:</strong> {booking.pickup}</p>
                      <p><strong>To:</strong> {booking.destination}</p>
                      <p><strong>Date:</strong> {booking.date}</p>
                      <p><strong>Time:</strong> {booking.time}</p>
                      {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                    </>
                  ) : (
                    <>
                      <p><strong>From:</strong> {booking.rideDetails?.pickup || booking.pickup}</p>
                      <p><strong>To:</strong> {booking.rideDetails?.destination || booking.destination}</p>
                      <p><strong>Date:</strong> {booking.rideDetails?.date || booking.date}</p>
                      <p><strong>Time:</strong> {booking.rideDetails?.time || booking.time}</p>
                      <p><strong>Vehicle:</strong> {booking.rideDetails?.vehicle || booking.vehicle}</p>
                      <p><strong>Driver:</strong> {booking.rideDetails?.driver || booking.driver}</p>
                    </>
                  )}
                  <p><strong>Seats:</strong> {booking.seats}</p>
                  {booking.rideDetails?.price && <p><strong>Price:</strong> {booking.rideDetails.price}</p>}
                </div>

                <div className="booking-actions">
                  <Link to={`/viewdetails/${booking.rideId}`} className="view-btn">
                    View Ride Details
                  </Link>

                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id, booking.rideId)}
                      className="cancel-btn"
                    >
                      Cancel Request
                    </button>
                  )}

                  {booking.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => handleContactDriver(contactNumber)}
                        className="contact-btn"
                      >
                        Contact Driver
                      </button>
                      {showContact === contactNumber && (
                        <div className="contact-info">
                          <p>Driver's Contact: <strong>{contactNumber}</strong></p>
                          <p className="contact-note">(This info will disappear in 5 seconds)</p>
                        </div>
                      )}
                    </>
                  )}

                  {booking.status === 'completed' && (
                    <span className="completed-label">Trip Completed</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="actions" style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link to="/availablerides" className="secondary-btn">
          ← Browse More Rides
        </Link>
      </div>
    </div>
  )
}

export default MyBookings