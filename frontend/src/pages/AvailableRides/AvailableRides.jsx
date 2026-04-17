import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsLoggedIn } from '../Redux/userSlice'
import { acceptRequest } from '../Redux/rideSlice'
import {
  selectAllRides,
  selectFilteredRides,
  searchRides
} from '../Redux/rideSlice'
import './AvailableRides.css'
import toast from 'react-hot-toast'

const AvailableRides = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const allRides = useSelector(selectAllRides)
  const filteredRides = useSelector(selectFilteredRides)

  const pickupParam = searchParams.get('pickup') || ''
  const destinationParam = searchParams.get('destination') || ''
  const dateParam = searchParams.get('date') || ''
  const seatsParam = searchParams.get('seats') || ''

  const [pickup, setPickup] = useState(pickupParam)
  const [destination, setDestination] = useState(destinationParam)
  const [date, setDate] = useState(dateParam)
  const [seats, setSeats] = useState(seatsParam)

  const handleSearch = (e) => {
    e.preventDefault()

    const params = {}
    if (pickup) params.pickup = pickup
    if (destination) params.destination = destination
    if (date) params.date = date
    if (seats) params.seats = seats

    setSearchParams(params)
  }

  const handleClearFilters = () => {
    setPickup('')
    setDestination('')
    setDate('')
    setSeats('')
    setSearchParams({})
    dispatch(searchRides({
      pickup: '',
      destination: '',
      date: '',
      seats: ''
    }))

  }

  const ridesToShow = filteredRides.length > 0 ? filteredRides : allRides

  useEffect(() => {
    const params = {}
    if (pickupParam) params.pickup = pickupParam
    if (destinationParam) params.destination = destinationParam
    if (dateParam) params.date = dateParam
    if (seatsParam) params.seats = seatsParam

    dispatch(searchRides(params))
  }, [pickupParam, destinationParam, dateParam, seatsParam, dispatch])

  return (
    <div className="rides-container">
      <div className="rides-header">
        <h2>Available Rides</h2>
        {isLoggedIn && (
          <button className="post-ride-btn" onClick={() => navigate('/postrides')}>
            Post a Ride
          </button>
        )}
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-grid">
          <input type="text" placeholder="Pickup Location" className="search-input" value={pickup}
            onChange={(e) => setPickup(e.target.value)} />

          <input type="text" placeholder="Destination" className="search-input" value={destination}
            onChange={(e) => setDestination(e.target.value)} />

          <input type="date" className="search-input" value={date}
            onChange={(e) => setDate(e.target.value)} />

          <select className="search-input" value={seats} onChange={(e) => setSeats(e.target.value)}>
            <option value="">Any Seats</option>
            <option value="1">1+ Seats</option>
            <option value="2">2+ Seats</option>
            <option value="3">3+ Seats</option>
            <option value="4">4+ Seats</option>
          </select>
        </div>

        <div className="search-buttons">
          <button type="submit" className="search-btn">
            Search
          </button>
          <button type="button" className="clear-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
      </form>

      <div className="results-count">
        Found {ridesToShow.length} ride{ridesToShow.length !== 1 ? 's' : ''}
      </div>

      {ridesToShow.length === 0 ? (
        <div className="no-rides">
          <h3>No rides available</h3>
          <p>Oopsies :( </p>
          <button className="post-ride-btn" onClick={() => navigate('/postrides')}>
            Post a Ride
          </button>
        </div>
      ) : (
        <div className="rides-grid">
          {ridesToShow.map((ride) => (
            <div key={ride.id} className="ride-card">
              <div className="ride-header">
                <h3 className="driver-name">{ride.driver}</h3>
                <span className="vehicle-type">{ride.vehicle}</span>
                {ride.isRequest && (
                  <span className="request-badge">Requested Ride</span>
                )}
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
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{ride.date}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Seats:</span>
                  <span className="detail-value seats-badge">
                    {ride.availableSeats} left
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value price">{ride.price}</span>
                </div>
              </div>

              <div className="ride-actions">
                <Link to={`/viewdetails/${ride.id}`} className="view-btn">
                  View Details
                </Link>
                {ride.isRequest ? (
                  <button
                    className="book-btn"
                    onClick={() => {
                      dispatch(acceptRequest(ride.id))
                      toast.success('Ride request accepted!')
                    }}
                  >
                    Accept Request
                  </button>
                ) : (
                  <button
                    className="book-btn"
                    onClick={() => navigate(`/bookseat/${ride.id}`)}
                    disabled={ride.availableSeats === 0}
                  >
                    {ride.availableSeats === 0 ? 'Full' : 'Book Seat'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AvailableRides