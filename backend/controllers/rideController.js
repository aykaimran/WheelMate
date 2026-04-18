const Ride = require('../models/Ride');

//get all rides with optional filters
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
            // Convert string date to Date object (start of day)
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }
        if (seats) {
            query.availableSeats = { $gte: parseInt(seats) };
        }
        
        const rides = await Ride.find(query).sort({ date: 1, time: 1 });
        
        const formattedRides = rides.map(ride => ({
            ...ride._doc,
            date: ride.date.toISOString().split('T')[0]
        }));
        
        res.json({
            success: true,
            count: formattedRides.length,
            rides: formattedRides
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

//get ride by id
const getRideById = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ride not found' 
            });
        }
        
        const formattedRide = {
            ...ride._doc,
            date: ride.date.toISOString().split('T')[0]
        };
        
        res.json({
            success: true,
            ride: formattedRide
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

//create new ride
const createRide = async (req, res) => {
    try {
        const rideData = {
            ...req.body,
            driverId: req.user.id,
            driver: req.user.name,
            date: new Date(req.body.date) // convert to Date object
        };
        
        const ride = await Ride.create(rideData);
        
        const formattedRide = {
            ...ride._doc,
            date: ride.date.toISOString().split('T')[0]
        };
        
        res.status(201).json({
            success: true,
            ride: formattedRide
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

//update ride
const updateRide = async (req, res) => {
    try {
        let ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ride not found' 
            });
        }
        if (ride.driverId.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized' 
            });
        }
        
        if (req.body.date) req.body.date = new Date(req.body.date);
        ride = await Ride.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        const formattedRide = {
            ...ride._doc,
            date: ride.date.toISOString().split('T')[0]
        };
        
        res.json({
            success: true,
            ride: formattedRide
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

//delete ride
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
                message: 'Not authorized' 
            });
        }
        await ride.deleteOne();
        res.json({ success: true, message: 'Ride deleted' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

const RideRequest = require('../models/RideRequest');

//request a ride (passenger posts a ride request)
//request a ride (passenger posts a ride request)
const requestRide = async (req, res) => {
    try {
        console.log('=== REQUEST RIDE START ===');
        console.log('User ID:', req.user?.id);
        console.log('User Name:', req.user?.name);
        console.log('Request body:', req.body);
        
        const { pickup, destination, date, time, seats, notes } = req.body;
        
        // Validate required fields
        if (!pickup || !destination || !date || !time || !seats) {
            console.log('Missing required fields');
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields: pickup, destination, date, time, seats' 
            });
        }
        
        const RideRequest = require('../models/RideRequest');
        
        console.log('Creating ride request...');
        const rideRequest = await RideRequest.create({
            passengerId: req.user.id,
            passengerName: req.user.name,
            passengerEmail: req.user.email,
            pickup,
            destination,
            date: new Date(date),
            time,
            seats: parseInt(seats),
            notes: notes || '',
            status: 'pending'
        });
        
        console.log('Ride request created:', rideRequest._id);
        
        res.status(201).json({
            success: true,
            message: 'Ride request posted successfully',
            request: {
                id: rideRequest._id,
                pickup: rideRequest.pickup,
                destination: rideRequest.destination,
                date: rideRequest.date.toISOString().split('T')[0],
                time: rideRequest.time,
                seats: rideRequest.seats,
                notes: rideRequest.notes,
                status: rideRequest.status,
                createdAt: rideRequest.createdAt
            }
        });
    } catch (error) {
        console.error('REQUEST RIDE ERROR:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            stack: error.stack 
        });
    }
};

//get pending ride requests (for drivers to view and accept)
const getPendingRequests = async (req, res) => {
    try {
        const requests = await RideRequest.find({ status: 'pending' })
            .sort({ createdAt: -1 });
        
        const formattedRequests = requests.map(request => ({
            id: request._id,
            passengerName: request.passengerName,
            passengerEmail: request.passengerEmail,
            pickup: request.pickup,
            destination: request.destination,
            date: request.date.toISOString().split('T')[0],
            time: request.time,
            seats: request.seats,
            notes: request.notes,
            status: request.status,
            createdAt: request.createdAt
        }));
        
        res.json({
            success: true,
            count: formattedRequests.length,
            requests: formattedRequests
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

//accept a ride request (driver accepts a passenger's request and adds them to their ride)
const acceptRideRequest = async (req, res) => {
    try {
        const { rideId } = req.body; // The driver's existing ride ID
        const requestId = req.params.requestId;
        
        const rideRequest = await RideRequest.findById(requestId);
        if (!rideRequest) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ride request not found' 
            });
        }
        
        if (rideRequest.status !== 'pending') {
            return res.status(400).json({ 
                success: false, 
                message: 'This request has already been processed' 
            });
        }
        
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ride not found' 
            });
        }
        
        if (ride.driverId.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'You can only accept requests for your own rides' 
            });
        }
        
        if (ride.availableSeats < rideRequest.seats) {
            return res.status(400).json({ 
                success: false, 
                message: `Not enough seats available. Only ${ride.availableSeats} seats left` 
            });
        }
        
        rideRequest.status = 'accepted';
        rideRequest.acceptedBy = req.user.id;
        rideRequest.acceptedRideId = rideId;
        await rideRequest.save();
        
        ride.bookings.push({
            userId: rideRequest.passengerId,
            userName: rideRequest.passengerName,
            userEmail: rideRequest.passengerEmail,
            seats: rideRequest.seats,
            status: 'confirmed'
        });
        
        ride.availableSeats -= rideRequest.seats;
        await ride.save();
        
        res.json({
            success: true,
            message: 'Ride request accepted successfully',
            booking: {
                rideId: ride._id,
                driver: ride.driver,
                pickup: ride.pickup,
                destination: ride.destination,
                date: ride.date.toISOString().split('T')[0],
                time: ride.time,
                seats: rideRequest.seats,
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

//get my ride requests (for passengers to view their own requests)
const getMyRideRequests = async (req, res) => {
    try {
        const requests = await RideRequest.find({ passengerId: req.user.id })
            .sort({ createdAt: -1 });
        
        const formattedRequests = requests.map(request => ({
            id: request._id,
            pickup: request.pickup,
            destination: request.destination,
            date: request.date.toISOString().split('T')[0],
            time: request.time,
            seats: request.seats,
            notes: request.notes,
            status: request.status,
            acceptedBy: request.acceptedBy,
            createdAt: request.createdAt
        }));
        
        res.json({
            success: true,
            count: formattedRequests.length,
            requests: formattedRequests
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

//cancel a ride request (passenger cancels their pending request)
const cancelRideRequest = async (req, res) => {
    try {
        const rideRequest = await RideRequest.findById(req.params.requestId);
        
        if (!rideRequest) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ride request not found' 
            });
        }
        
        if (rideRequest.passengerId.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to cancel this request' 
            });
        }
        
        if (rideRequest.status !== 'pending') {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot cancel request that is ${rideRequest.status}` 
            });
        }
        
        rideRequest.status = 'rejected';
        await rideRequest.save();
        
        res.json({
            success: true,
            message: 'Ride request cancelled successfully'
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
    requestRide,
    getPendingRequests,
    acceptRideRequest,
    getMyRideRequests,
    cancelRideRequest
};