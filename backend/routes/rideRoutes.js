const express = require('express');
const router = express.Router();
const {
    getRides,
    getRideById,
    createRide,
    updateRide,
    deleteRide,
    bookSeat,
    requestRide,
    getMyBookings,
    cancelBooking
} = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getRides);
router.get('/mybookings', protect, getMyBookings);
router.get('/:id', getRideById);
router.post('/', protect, createRide);
router.post('/request', protect, requestRide);
router.post('/:id/book', protect, bookSeat);
router.put('/:id', protect, updateRide);
router.delete('/:id', protect, deleteRide);
router.put('/:rideId/cancel/:bookingId', protect, cancelBooking);

module.exports = router;