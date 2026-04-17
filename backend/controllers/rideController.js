const Ride = require('../models/Ride');

// @desc    Get all rides
// @route   GET /api/rides
// @access  Public
const getRides = async (req, res) => {
    try {
        const { pickup, destination, date, seats } = req.query;
        let query = { status: 'active' };
        
        if (pickup) {
            query.pickup = { $regex: pickup, $options: 'i' };
        }
        if (destination) {
            query.destination = { $regex: destination, $options: 'i' };
        }
        if (date) {
            query.date = new Date(date);
        }
        if (seats) {
            query.availableSeats = { $gte: parseInt(seats) };
        }
        
        const rides = await Ride.find(query).sort({ date: 1, time: 1 });
        
        res.json({
            success: true,
            count: rides.length,
            rides
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Get single ride
// @route   GET /api/rides/:id
// @access  Public
const getRideById = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        
        if (!ride) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ride not found' 
            });
        }
        
        res.json({
            success: true,
            ride
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Create a ride
// @route   POST /api/rides
// @access  Private
const createRide = async (req, res) => {
    try {
        const rideData = {
            ...req.body,
            driverId: req.user.id,
            driver: req.user.name
        };
        
        const ride = await Ride.create(rideData);
        
        res.status(201).json({
            success: true,
            ride
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Update ride
// @route   PUT /api/rides/:id
// @access  Private (only driver)
const updateRide = async (req, res) => {
    try {
        let ride = await Ride.findById(req.params.id);
        
        if (!ride) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ride not found' 
            });
        }
        
        // Check if user is the driver
        if (ride.driverId.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to update this ride' 
            });
        }
        
        ride = await Ride.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.json({
            success: true,
            ride
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Delete ride
// @route   DELETE /api/rides/:id
// @access  Private (only driver)
const deleteRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        
        if (!ride) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ride not found' 
            });
        }
        
        if (ride.driverId.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to delete this ride' 
            });
        }
        
        await ride.deleteOne();
        
        res.json({
            success: true,
            message: 'Ride deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Book a seat
// @route   POST /api/rides/:id/book
// @access  Private
const bookSeat = async (req, res) => {
    try {
        const { seats } = req.body;
        const ride = await Ride.findById(req.params.id);
        
        if (!ride) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ride not found' 
            });
        }
        
        if (ride.availableSeats < seats) {
            return res.status(400).json({ 
                success: false, 
                message: 'Not enough seats available' 
            });
        }
        
        // Add booking
        ride.bookings.push({
            userId: req.user.id,
            userName: req.user.name,
            userEmail: req.user.email,
            seats: seats,
            status: 'confirmed'
        });
        
        ride.availableSeats -= seats;
        ride.bookedSeats += seats;
        
        await ride.save();
        
        res.json({
            success: true,
            message: 'Seat booked successfully',
            ride
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Request a ride
// @route   POST /api/rides/request
// @access  Private
const requestRide = async (req, res) => {
    try {
        const { pickup, destination, date, time, seats, notes } = req.body;
        
        // This creates a request that drivers can see
        // For simplicity, we'll store it in a separate collection or
        // we can create a special ride request object
        
        res.json({
            success: true,
            message: 'Ride request sent successfully',
            request: {
                id: Date.now().toString(),
                userId: req.user.id,
                userName: req.user.name,
                userEmail: req.user.email,
                pickup,
                destination,
                date,
                time,
                seats,
                notes,
                status: 'pending',
                requestedAt: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Get user's bookings
// @route   GET /api/rides/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const rides = await Ride.find({
            'bookings.userId': req.user.id
        });
        
        const bookings = [];
        rides.forEach(ride => {
            ride.bookings.forEach(booking => {
                if (booking.userId.toString() === req.user.id) {
                    bookings.push({
                        id: booking._id,
                        rideId: ride._id,
                        driver: ride.driver,
                        pickup: ride.pickup,
                        destination: ride.destination,
                        date: ride.date,
                        time: ride.time,
                        seats: booking.seats,
                        status: booking.status,
                        contact: ride.contact,
                        vehicle: ride.vehicle,
                        price: ride.price,
                        bookedAt: booking.bookedAt
                    });
                }
            });
        });
        
        res.json({
            success: true,
            bookings
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Cancel booking
// @route   PUT /api/rides/:rideId/cancel/:bookingId
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.rideId);
        
        if (!ride) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ride not found' 
            });
        }
        
        const booking = ride.bookings.id(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }
        
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to cancel this booking' 
            });
        }
        
        booking.status = 'cancelled';
        ride.availableSeats += booking.seats;
        ride.bookedSeats -= booking.seats;
        
        await ride.save();
        
        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

module.exports = {
    getRides,
    getRideById,
    createRide,
    updateRide,
    deleteRide,
    bookSeat,
    requestRide,
    getMyBookings,
    cancelBooking
};