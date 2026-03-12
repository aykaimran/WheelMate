import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../Redux/userSlice'
import { requestRide } from '../Redux/rideSlice'  // Import requestRide
import toast from 'react-hot-toast'
import './RequestRide.css'

const RequestRide = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    seats: '1',
    notes: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Check if user is logged in
    if (!currentUser) {
      toast.error('Please login to request a ride')
      navigate('/login')
      return
    }

    // Validate required fields
    if (!formData.pickup || !formData.destination || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields')
      return
    }

    // Create a ride request (this will be visible to all drivers)
    // In a real app, this would be stored in a "requests" collection
    // For now, we'll create a pending booking
    dispatch(requestRide({
      rideId: 'request-' + Date.now(), // Temporary ID
      useremail: currentUser.email,
      seatsRequested: parseInt(formData.seats),
      passengerInfo: {
        name: currentUser.name,
        email: currentUser.email,
        notes: formData.notes
      },
      requestDetails: {
        pickup: formData.pickup,
        destination: formData.destination,
        date: formData.date,
        time: formData.time
      }
    }))

    toast.success('Ride request sent to all drivers!')
    navigate('/mybookings')
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="request-container">
      <h2>Request a Ride</h2>
      <p className="request-subtitle">Post your request - drivers will see it and can accept</p>
      
      <form className="request-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Pickup Location:</label>
          <input 
            type="text" 
            name="pickup"
            placeholder="e.g. Gulshan Campus"
            value={formData.pickup}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Destination:</label>
          <input 
            type="text" 
            name="destination"
            placeholder="e.g. DHA Phase 6"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Date:</label>
            <input 
              type="date" 
              name="date"
              min={today}
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Time:</label>
            <input 
              type="time" 
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Number of Seats:</label>
          <select 
            name="seats"
            value={formData.seats}
            onChange={handleChange}
          >
            <option value="1">1 seat</option>
            <option value="2">2 seats</option>
            <option value="3">3 seats</option>
            <option value="4">4 seats</option>
          </select>
        </div>

        <div className="form-group">
          <label>Additional Notes:</label>
          <textarea 
            name="notes"
            rows="3" 
            placeholder="Any specific requirements..."
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          Post Ride Request
        </button>
      </form>

      <div className="actions" style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to="/availablerides" className="secondary-btn">
          ← Browse Available Rides
        </Link>
      </div>
    </div>
  )
}

export default RequestRide