const Ride = require('../models/Ride');

//book a seat in a ride
const bookSeat = async (req, res) => {
    try {
        const { seats } = req.body;
        const ride = await Ride.findById(req.params.rideId);
        
        if (!ride) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ride not found' 
            });
        }
        
        if (ride.status !== 'active') {
            return res.status(400).json({ 
                success: false, 
                message: 'Ride is no longer active' 
            });
        }
        
        if (ride.availableSeats < seats) {
            return res.status(400).json({ 
                success: false, 
                message: `Only ${ride.availableSeats} seat(s) available` 
            });
        }
        
        const existingBooking = ride.bookings.find(
            b => b.userId.toString() === req.user.id && b.status !== 'cancelled'
        );
        if (existingBooking) {
            return res.status(400).json({ 
                success: false, 
                message: 'You have already booked this ride' 
            });
        }
        
        ride.bookings.push({
            userId: req.user.id,
            userName: req.user.name,
            userEmail: req.user.email,
            seats: seats,
            status: 'confirmed'
        });
        
        ride.availableSeats -= seats;
        await ride.save();
        
        res.json({
            success: true,
            message: `${seats} seat(s) booked successfully`,
            booking: {
                rideId: ride._id,
                seats: seats,
                driver: ride.driver,
                pickup: ride.pickup,
                destination: ride.destination,
                date: ride.date.toISOString().split('T')[0],
                time: ride.time,
                vehicle: ride.vehicle,
                contact: ride.contact
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

//get my bookings
const getMyBookings = async (req, res) => {
    try {
        const rides = await Ride.find({ 'bookings.userId': req.user.id });
        
        const bookings = [];
        rides.forEach(ride => {
            ride.bookings.forEach(booking => {
                if (booking.userId.toString() === req.user.id && booking.status !== 'cancelled') {
                    bookings.push({
                        id: booking._id,
                        rideId: ride._id,
                        driver: ride.driver,
                        pickup: ride.pickup,
                        destination: ride.destination,
                        date: ride.date.toISOString().split('T')[0],
                        time: ride.time,
                        seats: booking.seats,
                        status: booking.status,
                        vehicle: ride.vehicle,
                        price: ride.price,
                        contact: ride.contact,
                        bookedAt: booking.bookedAt
                    });
                }
            });
        });
        
        res.json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

//cancel booking
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
                message: 'Not authorized' 
            });
        }
        
        booking.status = 'cancelled';
        ride.availableSeats += booking.seats;
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
    bookSeat,
    getMyBookings,
    cancelBooking
};