const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }
});

const rideSchema = new mongoose.Schema({
    driver: {
        type: String,
        required: [true, 'Driver name is required']
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pickup: {
        type: String,
        required: [true, 'Pickup location is required']
    },
    destination: {
        type: String,
        required: [true, 'Destination is required']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    time: {
        type: String,
        required: [true, 'Time is required']
    },
    availableSeats: {
        type: Number,
        required: [true, 'Number of seats is required'],
        min: [1, 'At least 1 seat required'],
        max: [8, 'Maximum 8 seats allowed']
    },
    vehicle: {
        type: String,
        required: [true, 'Vehicle type is required']
    },
    price: {
        type: String,
        default: 'Rs. 0'
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required']
    },
    notes: {
        type: String,
        maxlength: [300, 'Notes cannot exceed 300 characters']
    },
    driverBio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'completed'],
        default: 'active'
    },
    bookings: [bookingSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ride', rideSchema);