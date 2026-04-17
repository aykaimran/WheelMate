const mongoose = require('mongoose');

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
    bookedSeats: {
        type: Number,
        default: 0
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
    bookings: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        userName: String,
        userEmail: String,
        seats: Number,
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending'
        },
        bookedAt: {
            type: Date,
            default: Date.now
        }
    }],
    rideRequests: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        userName: String,
        userEmail: String,
        seats: Number,
        pickup: String,
        destination: String,
        date: Date,
        time: String,
        notes: String,
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        requestedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ride', rideSchema);