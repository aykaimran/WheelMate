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

module.exports = {
    getRides,
    getRideById,
    createRide,
    updateRide,
    deleteRide
};