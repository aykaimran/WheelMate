import React, { useState, useEffect } from 'react'
import './PostRides.css'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createRide  } from '../Redux/rideSlice'
import { selectCurrentUser } from '../Redux/userSlice'
import toast from 'react-hot-toast'

const PostRides = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    driverBio: ''
  })

  const [errors, setErrors] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    vehicle: '',
    contact: '',
    price: ''
  })

  const [seats, setSeats] = useState(1)

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to post a ride')
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

  const validateVehicle = (value) => {
    if (!value) return 'Vehicle type is required'
    if (value.length < 2) return 'Please enter a valid vehicle type'
    return ''
  }

  const validateContact = (value) => {
    if (!value) return 'Contact number is required'
    const phoneRegex = /^03[0-9]{2}[0-9]{7}$|^\+92[0-9]{10}$/
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Please enter a valid Pakistani phone number (e.g., 03001234567)'
    }
    return ''
  }

  const validatePrice = (value) => {
    if (value && !/^\d+$/.test(value) && !/^Rs\.?\s*\d+$/.test(value)) {
      return 'Please enter a valid price (e.g., 150 or Rs. 150)'
    }
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
      case 'vehicle':
        error = validateVehicle(value)
        break
      case 'contact':
        error = validateContact(value)
        break
      case 'price':
        error = validatePrice(value)
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
      case 'vehicle':
        error = validateVehicle(value)
        break
      case 'contact':
        error = validateContact(value)
        break
      case 'price':
        error = validatePrice(value)
        break
      default:
        break
    }
    setErrors({ ...errors, [name]: error })
  }

  const increaseSeats = () => {
    if (seats < 8) {
      setSeats(seats + 1)
    } else {
      toast.error('Maximum 8 seats allowed')
    }
  }

  const decreaseSeats = () => {
    if (seats > 1) {
      setSeats(seats - 1)
    }
  }

  const validateForm = () => {
    const pickupError = validatePickup(formData.pickup)
    const destinationError = validateDestination(formData.destination)
    const dateError = validateDate(formData.date)
    const timeError = validateTime(formData.time)
    const vehicleError = validateVehicle(formData.vehicle)
    const contactError = validateContact(formData.contact)
    const priceError = validatePrice(formData.price)

    setErrors({
      pickup: pickupError,
      destination: destinationError,
      date: dateError,
      time: timeError,
      vehicle: vehicleError,
      contact: contactError,
      price: priceError
    })

    return !pickupError && !destinationError && !dateError && !timeError && !vehicleError && !contactError
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    if (isSubmitting) {
      toast.loading('Posting your ride...')
      return
    }

    setIsSubmitting(true)

    const newRide = {
      driver: formData.driver || currentUser.name,
      pickup: formData.pickup.trim(),
      destination: formData.destination.trim(),
      date: formData.date,
      time: formData.time,
      availableSeats: seats,
      vehicle: formData.vehicle.trim(),
      contact: formData.contact.replace(/\s/g, ''),
      notes: formData.notes.trim() || 'No additional notes',
      price: formData.price ? `Rs. ${formData.price.replace(/[^0-9]/g, '')}` : 'Not specified',
      driverEmail: currentUser.email,
      driverBio: formData.driverBio.trim() || `${currentUser.name} is a friendly driver who enjoys meeting new people.`
    }

    try {
      dispatch(createRide(newRide))
      toast.success('Ride posted successfully!')
      setTimeout(() => {
        navigate('/availablerides')
      }, 1500)
    } catch (error) {
      toast.error('Failed to post ride. Please try again.')
      setIsSubmitting(false)
    }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="post-container">
      <h2>Post a Ride</h2>

      <form className="post-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Driver Name:</label>
          <input type="text" name="driver" placeholder="Enter your name" value={formData.driver}
            onChange={handleChange} required disabled={isSubmitting}/>
        </div>

        <div className="form-group">
          <label>Pickup Location:</label>
          <input type="text" name="pickup" placeholder="e.g. Lahore Campus" value={formData.pickup}
            onChange={handleChange} onBlur={handleBlur} className={errors.pickup ? 'input-error' : ''}
            required disabled={isSubmitting}/>
          {errors.pickup && <p className="error-message">{errors.pickup}</p>}
        </div>

        <div className="form-group">
          <label>Destination:</label>
          <input type="text"  name="destination" placeholder="e.g. Jorapul" value={formData.destination}
            onChange={handleChange} onBlur={handleBlur} className={errors.destination ? 'input-error' : ''}
            required disabled={isSubmitting}
          />
          {errors.destination && <p className="error-message">{errors.destination}</p>}
        </div>

        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Date:</label>
            <input type="date" name="date" min={minDate} value={formData.date} onChange={handleChange}
              onBlur={handleBlur} className={errors.date ? 'input-error' : ''}
              required  disabled={isSubmitting} />
            {errors.date && <p className="error-message">{errors.date}</p>}
          </div>

          <div className="form-group">
            <label>Departure Time:</label>
            <input type="time" name="time" value={formData.time} onChange={handleChange}
              onBlur={handleBlur} className={errors.time ? 'input-error' : ''}
              required disabled={isSubmitting}/>
            {errors.time && <p className="error-message">{errors.time}</p>}
          </div>
        </div>

        <div className="form-group">
          <label>Available Seats:</label>
          <div className="seat-counter">
            <button type="button" onClick={decreaseSeats} className="counter-btn"
              disabled={isSubmitting || seats <= 1}> −</button>

            <span className="seat-count">{seats}</span>

            <button
              type="button"
              onClick={increaseSeats}
              className="counter-btn"
              disabled={isSubmitting || seats >= 8}
            >+</button>
          </div>
          <small className="form-text">Maximum 8 seats allowed</small>
        </div>

        <div className="form-group">
          <label>Vehicle Type:</label>
          <input type="text" name="vehicle" placeholder="e.g. Toyota Corolla, Suzuki Cultus"
            value={formData.vehicle} onChange={handleChange}  onBlur={handleBlur}
            className={errors.vehicle ? 'input-error' : ''} required
            disabled={isSubmitting} />
          {errors.vehicle && <p className="error-message">{errors.vehicle}</p>}
        </div>

        <div className="form-group">
          <label>Contact Number:</label>
          <input
            type="text"
            name="contact"
            placeholder="03001234567"
            value={formData.contact}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.contact ? 'input-error' : ''}
            required
            disabled={isSubmitting}
          />
          {errors.contact && <p className="error-message">{errors.contact}</p>}
          <small className="form-text">Pakistani mobile number (e.g., 03001234567)</small>
        </div>

        <div className="form-group">
          <label>Price (Optional):</label>
          <input type="text" name="price" placeholder="e.g. 150" value={formData.price}
            onChange={handleChange} onBlur={handleBlur} className={errors.price ? 'input-error' : ''}
            disabled={isSubmitting}
          />
          {errors.price && <p className="error-message">{errors.price}</p>}
          <small className="form-text">Leave empty if free</small>
        </div>

        <div className="form-group">
          <label>About You (Driver Bio):</label>
          <textarea name="driverBio" rows="3"
            placeholder="Tell passengers about yourself... (e.g., I'm a friendly driver who loves good music and conversation)"
            value={formData.driverBio} onChange={handleChange} disabled={isSubmitting}
            maxLength={500} ></textarea>
          <small className="form-text">
            {formData.driverBio.length}/500 characters - This will be visible to passengers
          </small>
        </div>

        <div className="form-group">
          <label>Additional Notes:</label>
          <textarea name="notes" rows="3" placeholder="Any extra details about the ride..."
            value={formData.notes} onChange={handleChange} disabled={isSubmitting}
            maxLength={300} ></textarea>
          <small className="form-text">{formData.notes.length}/300 characters</small>
        </div>

        <button  type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Ride'}
        </button>
      </form>

      <div className="actions">
        <Link to="/availablerides" className="secondary-btn">← Back to Rides</Link>
      </div>
    </div>
  )
}

export default PostRides