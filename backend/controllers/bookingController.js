const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');


//book a seat in a ride
//book a seat in a ride
const bookSeat = async (req, res) => {
    try {
        console.log('=== BOOK SEAT START ===');
        console.log('Ride ID:', req.params.rideId);
        console.log('User ID:', req.user?.id);
        console.log('Request body:', req.body);
        
        const { seats } = req.body;
        
        if (!seats || seats < 1) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please specify number of seats (at least 1)' 
            });
        }
        
        const ride = await Ride.findById(req.params.rideId);
        
        if (!ride) {
            console.log('Ride not found:', req.params.rideId);
            return res.status(404).json({ 
                success: false, 
                message: 'Ride not found' 
            });
        }
        
        console.log('Ride found:', ride._id, 'Available seats:', ride.availableSeats);
        
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
        
        // Check if user already booked this ride
        const existingBooking = ride.bookings.find(
            b => b.userId && b.userId.toString() === req.user.id && b.status !== 'cancelled'
        );
        if (existingBooking) {
            return res.status(400).json({ 
                success: false, 
                message: 'You have already booked this ride' 
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
        await ride.save();
        
        console.log('Booking successful!');
        
        res.json({
            success: true,
            message: `${seats} seat(s) booked successfully`,
            booking: {
                rideId: ride._id,
                seats: seats,
                driver: ride.driver,
                pickup: ride.pickup,
                destination: ride.destination,
                date: ride.date ? ride.date.toISOString().split('T')[0] : '',
                time: ride.time,
                vehicle: ride.vehicle,
                contact: ride.contact
            }
        });
    } catch (error) {
        console.error('BOOK SEAT ERROR:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            stack: error.stack 
        });
    }
};

//get my bookings
const getMyBookings = async (req, res) => {
    try {
        console.log('Getting bookings for user:', req.user.id);
        
        // 1. Get direct bookings from Ride.bookings array
        const rides = await Ride.find({ 'bookings.userId': req.user.id });
        
        const bookings = [];
        
        // Add direct bookings
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
                        type: 'direct-booking',
                        vehicle: ride.vehicle,
                        price: ride.price,
                        contact: ride.contact,
                        bookedAt: booking.bookedAt
                    });
                }
            });
        });
        
        // 2. Get ride requests (pending, accepted, rejected)
        const rideRequests = await RideRequest.find({ passengerId: req.user.id })
            .sort({ createdAt: -1 });
        
        // Add ride requests
        rideRequests.forEach(request => {
            bookings.push({
                id: request._id,
                rideId: request.acceptedRideId || request._id,
                driver: request.acceptedBy ? 'Driver assigned' : 'Waiting for driver',
                pickup: request.pickup,
                destination: request.destination,
                date: request.date.toISOString().split('T')[0],
                time: request.time,
                seats: request.seats,
                status: request.status, // pending, accepted, rejected, completed
                type: 'ride-request',
                notes: request.notes,
                requestedAt: request.createdAt,
                acceptedBy: request.acceptedBy
            });
        });
        
        // Sort by date (newest first)
        bookings.sort((a, b) => new Date(b.bookedAt || b.requestedAt) - new Date(a.bookedAt || a.requestedAt));
        
        console.log(`Found ${bookings.length} total items (${rides.length} direct bookings, ${rideRequests.length} requests)`);
        
        res.json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error('Get my bookings error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
//cancel booking (handles both direct bookings AND ride requests)
const cancelBooking = async (req, res) => {
    try {
        const { rideId, bookingId } = req.params;
        
        // First, check if this is a ride request
        const rideRequest = await RideRequest.findOne({ 
            _id: bookingId,
            passengerId: req.user.id,
            status: 'pending'
        });
        
        if (rideRequest) {
            // Cancel the ride request
            rideRequest.status = 'rejected';
            await rideRequest.save();
            
            return res.json({
                success: true,
                message: 'Ride request cancelled successfully'
            });
        }
        
        // If not a ride request, try direct booking
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ride not found' 
            });
        }
        
        const booking = ride.bookings.id(bookingId);
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
        console.error('Cancel booking error:', error);
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