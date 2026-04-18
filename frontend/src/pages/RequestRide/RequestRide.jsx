import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../Redux/userSlice'
import { requestRide } from '../Redux/rideSlice'
import toast from 'react-hot-toast'
import './RequestRide.css'

const RequestRide = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    seats: '1',
    notes: ''
  })

  const [errors, setErrors] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    seats: ''
  })

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to request a ride')
      navigate('/login')
    }
  }, [currentUser, navigate])

  const validatePickup = (value) => {
    if (!value) return 'Pickup location is required'
    if (value.length < 3) return 'Pickup location must be at least 3 characters'
    return ''
  }

  const validateDestination = (value) => {
    if (!value) return 'Destination is required'
    if (value.length < 3) return 'Destination must be at least 3 characters'
    return ''
  }

  const validateDate = (value) => {
    if (!value) return 'Date is required'
    const selectedDate = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) return 'Date cannot be in the past'
    return ''
  }

  const validateTime = (value) => {
    if (!value) return 'Time is required'
    return ''
  }

  const validateSeats = (value) => {
    const seatsNum = parseInt(value)
    if (isNaN(seatsNum) || seatsNum < 1) return 'Please select at least 1 seat'
    if (seatsNum > 8) return 'Maximum 8 seats allowed'
    return ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    let error = ''
    switch(name) {
      case 'pickup':
        error = validatePickup(value)
        break
      case 'destination':
        error = validateDestination(value)
        break
      case 'date':
        error = validateDate(value)
        break
      case 'time':
        error = validateTime(value)
        break
      case 'seats':
        error = validateSeats(value)
        break
      default:
        break
    }
    setErrors({ ...errors, [name]: error })
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    let error = ''
    switch(name) {
      case 'pickup':
        error = validatePickup(value)
        break
      case 'destination':
        error = validateDestination(value)
        break
      case 'date':
        error = validateDate(value)
        break
      case 'time':
        error = validateTime(value)
        break
      case 'seats':
        error = validateSeats(value)
        break
      default:
        break
    }
    setErrors({ ...errors, [name]: error })
  }

  const validateForm = () => {
    const pickupError = validatePickup(formData.pickup)
    const destinationError = validateDestination(formData.destination)
    const dateError = validateDate(formData.date)
    const timeError = validateTime(formData.time)
    const seatsError = validateSeats(formData.seats)

    setErrors({
      pickup: pickupError,
      destination: destinationError,
      date: dateError,
      time: timeError,
      seats: seatsError
    })

    return !pickupError && !destinationError && !dateError && !timeError && !seatsError
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    if (isSubmitting) {
      toast.loading('Processing your request...')
      return
    }

    setIsSubmitting(true)

    try {
      dispatch(requestRide({
        pickup: formData.pickup,
        destination: formData.destination,
        date: formData.date,
        time: formData.time,
        seats: parseInt(formData.seats),
        notes: formData.notes
    }));

      toast.success('Ride request sent to all drivers!')
      setTimeout(() => {
        navigate('/mybookings')
      }, 1500)
    } catch (error) {
      toast.error('Failed to send request. Please try again.')
      setIsSubmitting(false)
    }
  }
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="request-container">
      <h2>Request a Ride</h2>
      <p className="request-subtitle">Post your request - drivers will see it and can accept</p>
      
      <form className="request-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Pickup Location:</label>
          <input 
            type="text" 
            name="pickup"
            placeholder="e.g. Gulshan Campus"
            value={formData.pickup}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.pickup ? 'input-error' : ''}
            required
            disabled={isSubmitting}
          />
          {errors.pickup && <p className="error-message">{errors.pickup}</p>}
        </div>

        <div className="form-group">
          <label>Destination:</label>
          <input 
            type="text" 
            name="destination"
            placeholder="e.g. DHA Phase 6"
            value={formData.destination}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.destination ? 'input-error' : ''}
            required
            disabled={isSubmitting}
          />
          {errors.destination && <p className="error-message">{errors.destination}</p>}
        </div>

        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Date:</label>
            <input 
              type="date" 
              name="date"
              min={minDate}
              value={formData.date}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.date ? 'input-error' : ''}
              required
              disabled={isSubmitting}
            />
            {errors.date && <p className="error-message">{errors.date}</p>}
          </div>

          <div className="form-group">
            <label>Time:</label>
            <input 
              type="time" 
              name="time"
              value={formData.time}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.time ? 'input-error' : ''}
              required
              disabled={isSubmitting}
            />
            {errors.time && <p className="error-message">{errors.time}</p>}
          </div>
        </div>

        <div className="form-group">
          <label>Number of Seats:</label>
          <select 
            name="seats"
            value={formData.seats}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.seats ? 'input-error' : ''}
            disabled={isSubmitting}
          >
            {[1,2,3,4,5,6,7,8].map(num => (
              <option key={num} value={num}>{num} seat{num > 1 ? 's' : ''}</option>
            ))}
          </select>
          {errors.seats && <p className="error-message">{errors.seats}</p>}
        </div>

        <div className="form-group">
          <label>Additional Notes:</label>
          <textarea  name="notes"  rows="3" 
            placeholder="Any specific requirements? (e.g., need space for luggage, prefer quiet rides, etc.)"
            value={formData.notes} onChange={handleChange} disabled={isSubmitting} maxLength={300}
          ></textarea>
          <small className="form-text">{formData.notes.length}/300 characters</small>
        </div>

        <button   type="submit"  className="submit-btn"  disabled={isSubmitting} >
          {isSubmitting ? 'Sending Request...' : 'Post Ride Request'}
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