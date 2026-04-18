const express = require('express');
const router = express.Router();
const {
    bookSeat,
    getMyBookings,
    cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/mybookings', protect, getMyBookings);
router.post('/:rideId/book', protect, bookSeat);
router.delete('/:rideId/:bookingId', protect, cancelBooking);

module.exports = router;