import React, { useState } from 'react'
import './PostRides.css'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addnewride } from '../Redux/rideSlice'
import { selectCurrentUser } from '../Redux/userSlice'
import toast from 'react-hot-toast'

const PostRides = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  // Form state
  const [formData, setFormData] = useState({
    driver: currentUser?.name || '',
    pickup: '',
    destination: '',
    date: '',
    time: '',
    vehicle: '',
    contact: '',
    notes: '',
    price: '',
    driverBio: ''  // 👈 ADD THIS
  })

  const [seats, setSeats] = useState(1)

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const increaseSeats = () => {
    setSeats(seats + 1)
  }

  const decreaseSeats = () => {
    if (seats > 1) {
      setSeats(seats - 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Check if user is logged in
    if (!currentUser) {
      toast.error('Please login to post a ride')
      navigate('/login')
      return
    }

    // Validate required fields
    if (!formData.pickup || !formData.destination || !formData.date || 
        !formData.time || !formData.vehicle || !formData.contact) {
      toast.error('Please fill in all required fields')
      return
    }

    // Create new ride object with driverBio
    const newRide = {
      driver: formData.driver || currentUser.name,
      pickup: formData.pickup,
      destination: formData.destination,
      date: formData.date,
      time: formData.time,
      availableSeats: seats,
      vehicle: formData.vehicle,
      contact: formData.contact,
      notes: formData.notes,
      price: formData.price || 'Rs. 0',
      driverEmail: currentUser.email,
      driverBio: formData.driverBio || `${currentUser.name} is a friendly driver who enjoys meeting new people.` // Default bio if not provided
    }

    // Dispatch to Redux
    dispatch(addnewride(newRide))
    
    // Show success message
    toast.success('Ride posted successfully! 🚗')
    
    // Redirect to available rides
    setTimeout(() => {
      navigate('/availablerides')
    }, 1500)
  }

  return (
    <div className="post-container">
      <h2>Post a Ride</h2>

      <form className="post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Driver Name:</label>
          <input 
            type="text" 
            name="driver"
            placeholder="Enter your name" 
            value={formData.driver}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Pickup Location:</label>
          <input 
            type="text" 
            name="pickup"
            placeholder="e.g. Lahore Campus" 
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
            placeholder="e.g. Jorapul" 
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Departure Time:</label>
          <input 
            type="time" 
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Available Seats:</label>
          <div className="seat-counter">
            <button
              type="button"
              onClick={decreaseSeats}
              className="counter-btn"
            >−</button>

            <span className="seat-count">{seats}</span>

            <button
              type="button"
              onClick={increaseSeats}
              className="counter-btn"
            >+</button>
          </div>
        </div>

        <div className="form-group">
          <label>Vehicle Type:</label>
          <input
            type="text"
            name="vehicle"
            placeholder="e.g. Toyota Corolla, Suzuki Cultus"
            value={formData.vehicle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Number:</label>
          <input
            type="text"
            name="contact"
            placeholder="03xx-xxxxxxx"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price (Optional):</label>
          <input
            type="text"
            name="price"
            placeholder="e.g. Rs. 150"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        {/* 👇 NEW: Driver Bio Field */}
        <div className="form-group">
          <label>About You (Driver Bio):</label>
          <textarea
            name="driverBio"
            rows="3"
            placeholder="Tell passengers about yourself... (e.g., I'm a friendly driver who loves good music and conversation)"
            value={formData.driverBio}
            onChange={handleChange}
          ></textarea>
          <small className="form-text" style={{ color: '#64748b', marginTop: '5px', display: 'block' }}>
            This will be visible to passengers when they view ride details
          </small>
        </div>

        <div className="form-group">
          <label>Additional Notes:</label>
          <textarea
            name="notes"
            rows="3"
            placeholder="Any extra details about the ride..."
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          Post Ride
        </button>
      </form>

      <div className="actions">
        <Link to="/availablerides" className="secondary-btn">Back</Link>
      </div>
    </div>
  )
}

export default PostRides