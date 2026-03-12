import { createSlice } from '@reduxjs/toolkit'

const rideSlice = createSlice({
    name: 'rides',
    initialState: {
        rides: [],
        riderequests: [],
        userbookings: [],
        error: null,
        properties: {
            pickup: '',
            destination: '',
            date: '',
            seats: 1
        }
    },

    reducers: {
        storeRides: (state, action) => {
            state.rides = action.payload
        },

        addNewRide: (state, action) => {
            const newRide = {
                id: Date.now().toString(),
                ...action.payload,
                createdAt: new Date().toISOString(),
                bookedSeats: 0,
                status: 'active',
                requests: []
            }
            state.rides.unshift(newRide)
        },

        bookRide: (state, action) => {
            const { rideId, userId, seatsRequested, passengerInfo } = action.payload
            const ride = state.rides.find(r => r.id === rideId)
            if (ride && ride.availableSeats >= seatsRequested) {
                const booking = {
                    id: Date.now().toString(),
                    rideId,
                    userId,
                    seats: seatsRequested,
                    passengerInfo,
                    status: 'confirmed',
                    bookedAt: new Date().toISOString()
                }
                state.riderequests.push(booking)
                state.userbookings.push(booking)
                ride.availableSeats -= seatsRequested
                ride.bookedSeats += seatsRequested
                state.error = null

            } else {
                state.error = 'Not enough seats available'
            }
        },

        updateSeatAvailability: (state, action) => {
            const { rideId, seats } = action.payload
            const ride = state.rides.find(r => r.id === rideId)

            if (ride) {
                ride.availableSeats = seats
            }
        },

        storeriderequests: (state, action) => {
            state.riderequests = action.payload
        },

        getuserbookings: (state, action) => {
            const userId = action.payload
            state.userbookings = state.riderequests.filter(
                booking => booking.userId === userId
            )
        },

        cancelBooking: (state, action) => {
            const { bookingId, rideId } = action.payload
            const booking = state.riderequests.find(b => b.id === bookingId)
            state.riderequests = state.riderequests.filter(b => b.id !== bookingId)
            state.userbookings = state.userbookings.filter(b => b.id !== bookingId)
            if (booking) {
                const ride = state.rides.find(r => r.id === rideId)
                if (ride) {
                    ride.availableSeats += booking.seats
                    ride.bookedSeats -= booking.seats
                }
            }
        },

        searchRides: (state, action) => {
            const searchParams = action.payload
            state.properties = {
                ...state.properties,
                ...searchParams
            }
        },
        selectRide: (state, action) => {
            const rideId = action.payload
            state.selectedRide = state.rides.find(r => r.id === rideId) || null
        },

        setRidesError: (state, action) => {
            state.error = action.payload
        },

        clearRidesError: (state) => {
            state.error = null
        }
    }
})

export const {
    storeRides,
    addNewRide,
    bookRide,
    updateSeatAvailability,
    storeriderequests,
    getuserbookings,
    cancelBooking,
    searchRides,
    selectRide,
    setRidesError,
    clearRidesError
} = rideSlice.actions

export const selectAllRides = (state) => state.rides.rides
export const selectFilteredRides = (state) => {
    const { rides, properties } = state.rides
    return rides.filter(ride => {
        if (properties.pickup && !ride.pickup.toLowerCase().includes(properties.pickup.toLowerCase())) {
            return false
        }
        if (properties.destination && !ride.destination.toLowerCase().includes(properties.destination.toLowerCase())) {
            return false
        }
        if (properties.date && ride.date !== properties.date) {
            return false
        }
        if (ride.availableSeats < properties.seats) {
            return false
        }
        return true
    })
}
export const selectuserbookings = (state) => state.rides.userbookings
export const selectSelectedRide = (state) => state.rides.selectedRide
export const selectRideById = (rideId) => (state) =>
    state.rides.rides.find(r => r.id === rideId)
export const selectRidesLoading = (state) => state.rides.loading
export const selectRidesError = (state) => state.rides.error
export const selectRideproperties = (state) => state.rides.properties

export default rideSlice.reducer