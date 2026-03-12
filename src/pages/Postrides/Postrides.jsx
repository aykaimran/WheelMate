import React from 'react'
import './PostRides.css'
import { Link } from 'react-router-dom'

const PostRides = () => {
  const [seats, setSeats] = React.useState(1)

  const increaseSeats = () => {
    // if (seats < 4) {
    //   setSeats(seats + 1)    // done if max seats can be 4
    // }

    setSeats(seats + 1) // done if no max limit for seats
  }

  const decreaseSeats = () => {
    if (seats > 1) {
      setSeats(seats - 1)
    }
  }

  return (
    <div className="post-container">
      <h2>Post a Ride</h2>

      <form className="post-form">
        <div className="form-group">
          <label>Driver Name:</label>
          <input type="text" placeholder="Enter your name" />
        </div>

        <div className="form-group">
          <label>Pickup Location:</label>
          <input type="text" placeholder="e.g. Lahore Campus" />
        </div>

        <div className="form-group">
          <label>Destination:</label>
          <input type="text" placeholder="e.g. Jorapul" />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input type="date" />
        </div>

        <div className="form-group">
          <label>Departure Time:</label>
          <input type="time" />
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
            placeholder="e.g. Toyota Corolla, Suzuki Cultus"
          />
        </div>

        <div className="form-group">
          <label>Contact Number:</label>
          <input
            type="text"
            placeholder="03xx-xxxxxxx"
          />
        </div>

        <div className="form-group">
          <label>Additional Notes:</label>
          <textarea
            rows="3"
            placeholder="Any extra details..."
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