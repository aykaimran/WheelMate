const express = require('express');
const router = express.Router();
const {
    getRides,
    getRideById,
    createRide,
    updateRide,
    deleteRide
} = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getRides)
    .post(protect, createRide);

router.route('/:id')
    .get(getRideById)
    .put(protect, updateRide)
    .delete(protect, deleteRide);

module.exports = router;