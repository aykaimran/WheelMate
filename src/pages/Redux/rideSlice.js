import { createSlice } from '@reduxjs/toolkit'

const initialRides = [
  {
    id: "1",
    driver: "Ali Raza",
    pickup: "Gulshan Campus",
    destination: "DHA Phase 6",
    time: "8:30 AM",
    date: "2024-03-15",
    availableSeats: 3,
    bookedSeats: 0,
    vehicle: "Toyota Corolla",
    price: "Rs. 150",
    driverEmail: "ali@example.com",
    status: 'active',
    contact: "03001234567",
    driverBio: "Ali is a friendly driver with 5 years of experience. He loves meeting new people and sharing stories during rides.",
    createdAt: "2024-03-10T10:00:00.000Z",
    requests: []
  },
  {
    id: "2",
    driver: "Sara Khan",
    pickup: "Main Campus",
    destination: "North Nazimabad",
    time: "9:15 AM",
    date: "2024-03-15",
    availableSeats: 2,
    bookedSeats: 0,
    vehicle: "Honda Civic",
    price: "Rs. 200",
    driverEmail: "sara@example.com",
    status: 'active',
    contact: "03007654321",
    driverBio: "Sara is a punctual and reliable driver. She enjoys driving and always ensures her passengers have a comfortable ride.",
    createdAt: "2024-03-10T11:00:00.000Z",
    requests: []
  },
  {
    id: "3",
    driver: "Ahmed Malik",
    pickup: "Gulshan Campus",
    destination: "Clifton",
    time: "10:00 AM",
    date: "2024-03-16",
    availableSeats: 4,
    bookedSeats: 0,
    vehicle: "Suzuki Swift",
    price: "Rs. 180",
    driverEmail: "ahmed@example.com",
    status: 'active',
    contact: "03009876543",
    driverBio: "Ahmed is a student driver who loves driving around the city. He is friendly and always up for a chat during the ride.",
    createdAt: "2024-03-11T09:00:00.000Z",
    requests: []
  },
  {
    id: "4",
    driver: "Fatima Khan",
    pickup: "Main Campus",
    destination: "Gulistan-e-Johar",
    time: "11:30 AM",
    date: "2024-03-16",
    availableSeats: 1,
    bookedSeats: 0,
    vehicle: "Cultus",
    price: "Rs. 120",
    driverEmail: "fatima@example.com",
    status: 'active',
    createdAt: "2024-03-11T14:00:00.000Z",
    requests: []
  }
]

const rideSlice = createSlice({
    name: 'rides',
    initialState: {
        rides: initialRides,
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
        storerides: (state, action) => {
            state.rides = action.payload
        },

        addnewride: (state, action) => {
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

        bookARide: (state, action) => {
            const { rideId, useremail, seatsRequested, passengerInfo } = action.payload
            const ride = state.rides.find(r => r.id === rideId)
            if (ride && ride.availableSeats >= seatsRequested) {
                const booking = {
                    id: Date.now().toString(),
                    rideId,
                    useremail,
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
            const useremail = action.payload
            state.userbookings = state.riderequests.filter(
                booking => booking.useremail === useremail
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
    storerides,
    addnewride,
    bookARide,
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
