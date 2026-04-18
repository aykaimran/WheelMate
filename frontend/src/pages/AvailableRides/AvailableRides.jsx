import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsLoggedIn, selectCurrentUser } from '../Redux/userSlice'
import { 
  fetchRides, 
  fetchPendingRequests,
  acceptRideRequest,
  setFilters, 
  clearFilters,
  selectAllRides,
  selectRideFilters,
  selectRidesLoading,
  selectPendingRequests
} from '../Redux/rideSlice'
import './AvailableRides.css'
import toast from 'react-hot-toast'

const AvailableRides = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const currentUser = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const allRides = useSelector(selectAllRides)
  const filters = useSelector(selectRideFilters)
  const loading = useSelector(selectRidesLoading)
  const pendingRequests = useSelector(selectPendingRequests)

  const [showRequests, setShowRequests] = useState(false)
  const [selectedRideId, setSelectedRideId] = useState('')

  const pickupParam = searchParams.get('pickup') || ''
  const destinationParam = searchParams.get('destination') || ''
  const dateParam = searchParams.get('date') || ''
  const seatsParam = searchParams.get('seats') || ''

  const [pickup, setPickup] = useState(pickupParam)
  const [destination, setDestination] = useState(destinationParam)
  const [date, setDate] = useState(dateParam)
  const [seats, setSeats] = useState(seatsParam)

  useEffect(() => {
    dispatch(fetchRides())
  }, [dispatch])

  useEffect(() => {
    if (showRequests && isLoggedIn) {
      dispatch(fetchPendingRequests())
    }
  }, [showRequests, isLoggedIn, dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = {}
    if (pickup) params.pickup = pickup
    if (destination) params.destination = destination
    if (date) params.date = date
    if (seats) params.seats = seats
    setSearchParams(params)
    dispatch(setFilters(params))
  }

  const handleClearFilters = () => {
    setPickup('')
    setDestination('')
    setDate('')
    setSeats('')
    setSearchParams({})
    dispatch(clearFilters())
  }

  useEffect(() => {
    const params = {}
    if (pickupParam) params.pickup = pickupParam
    if (destinationParam) params.destination = destinationParam
    if (dateParam) params.date = dateParam
    if (seatsParam) params.seats = seatsParam
    if (Object.keys(params).length > 0) {
      dispatch(setFilters(params))
    }
  }, [pickupParam, destinationParam, dateParam, seatsParam, dispatch])

  const filteredRides = allRides.filter(ride => {
    if (filters.pickup && !ride.pickup?.toLowerCase().includes(filters.pickup.toLowerCase())) return false
    if (filters.destination && !ride.destination?.toLowerCase().includes(filters.destination.toLowerCase())) return false
    if (filters.date && ride.date !== filters.date) return false
    if (filters.seats && ride.availableSeats < parseInt(filters.seats)) return false
    return true
  })

  const ridesToShow = filteredRides

  const handleAcceptRequest = (requestId) => {
    if (!selectedRideId) {
      toast.error('Please select a ride to assign this request to')
      return
    }
    dispatch(acceptRideRequest({ requestId, rideId: selectedRideId }))
      .unwrap()
      .then(() => {
        toast.success('Ride request accepted!')
        setSelectedRideId('')
        dispatch(fetchPendingRequests())
        dispatch(fetchRides())
      })
      .catch((error) => {
        toast.error(error || 'Failed to accept request')
      })
  }

  return (
    <div className="rides-container">
      <div className="rides-header">
        <h2>Available Rides</h2>
        <div className="header-buttons">
          {isLoggedIn && (
            <>
              <button 
                className="requests-toggle-btn"
                onClick={() => setShowRequests(!showRequests)}
              >
                {showRequests ? 'Hide Requests' : 'View Ride Requests'}
              </button>
              <button className="post-ride-btn" onClick={() => navigate('/postrides')}>
                Post a Ride
              </button>
            </>
          )}
        </div>
      </div>

      {showRequests && isLoggedIn && (
        <div className="requests-section">
          <h3>Pending Ride Requests</h3>
          {pendingRequests.length === 0 ? (
            <p className="no-requests">No pending ride requests</p>
          ) : (
            <div className="requests-grid">
              {pendingRequests.map((request) => (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <h4>{request.passengerName}</h4>
                    <span className="request-badge">Pending</span>
                  </div>
                  <div className="request-details">
                    <p><strong>From:</strong> {request.pickup}</p>
                    <p><strong>To:</strong> {request.destination}</p>
                    <p><strong>Date:</strong> {request.date}</p>
                    <p><strong>Time:</strong> {request.time}</p>
                    <p><strong>Seats:</strong> {request.seats}</p>
                    {request.notes && <p><strong>Notes:</strong> {request.notes}</p>}
                  </div>
                  <div className="request-actions">
                    <select 
                      className="ride-select"
                      value={selectedRideId}
                      onChange={(e) => setSelectedRideId(e.target.value)}
                    >
                      <option value="">Select your ride</option>
                      {allRides.filter(ride => ride.availableSeats >= request.seats).map(ride => (
                        <option key={ride._id || ride.id} value={ride._id || ride.id}>
                          {ride.pickup} → {ride.destination} ({ride.availableSeats} seats available)
                        </option>
                      ))}
                    </select>
                    <button 
                      className="accept-request-btn"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      Accept Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-grid">
          <input 
            type="text" 
            placeholder="Pickup Location" 
            className="search-input" 
            value={pickup}
            onChange={(e) => setPickup(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Destination" 
            className="search-input" 
            value={destination}
            onChange={(e) => setDestination(e.target.value)} 
          />
          <input 
            type="date" 
            className="search-input" 
            value={date}
            onChange={(e) => setDate(e.target.value)} 
          />
          <select 
            className="search-input" 
            value={seats} 
            onChange={(e) => setSeats(e.target.value)}
          >
            <option value="">Any Seats</option>
            <option value="1">1+ Seats</option>
            <option value="2">2+ Seats</option>
            <option value="3">3+ Seats</option>
            <option value="4">4+ Seats</option>
          </select>
        </div>
        <div className="search-buttons">
          <button type="submit" className="search-btn">Search</button>
          <button type="button" className="clear-btn" onClick={handleClearFilters}>Clear Filters</button>
        </div>
      </form>

      <div className="results-count">
        {loading ? (
          <p>Loading rides...</p>
        ) : (
          <p>Found {ridesToShow.length} ride{ridesToShow.length !== 1 ? 's' : ''}</p>
        )}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      ) : ridesToShow.length === 0 ? (
        <div className="no-rides">
          <h3>No rides available</h3>
          <p>Be the first to post a ride!</p>
          {isLoggedIn && (
            <button className="post-ride-btn" onClick={() => navigate('/postrides')}>
              Post a Ride
            </button>
          )}
        </div>
      ) : (
        <div className="rides-grid">
          {ridesToShow.map((ride) => (
            <div key={ride._id || ride.id} className="ride-card">
              <div className="ride-header">
                <h3 className="driver-name">{ride.driver}</h3>
                <span className="vehicle-type">{ride.vehicle}</span>
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
                <Link to={`/viewdetails/${ride._id || ride.id}`} className="view-btn">
                  View Details
                </Link>
                <button 
                  className="book-btn" 
                  onClick={() => navigate(`/bookseat/${ride._id || ride.id}`)}
                  disabled={ride.availableSeats === 0}
                >
                  {ride.availableSeats === 0 ? 'Full' : 'Book Seat'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AvailableRides