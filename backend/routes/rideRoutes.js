const express = require('express');
const router = express.Router();
const {
    getRides,
    getRideById,
    createRide,
    updateRide,
    deleteRide,
    requestRide,
    getPendingRequests,
    getMyRideRequests,
    acceptRideRequest,
    cancelRideRequest
} = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getRides).post(protect, createRide);

router.route('/:id').get(getRideById).put(protect, updateRide) .delete(protect, deleteRide);

router.post('/request', protect, requestRide);
router.get('/requests/pending', protect, getPendingRequests);
router.get('/myrequests', protect, getMyRideRequests);
router.put('/requests/:requestId/accept', protect, acceptRideRequest);
router.delete('/requests/:requestId', protect, cancelRideRequest);

module.exports = router;