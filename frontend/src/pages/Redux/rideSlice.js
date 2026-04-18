import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getRidesAPI,
    getRideByIdAPI,
    createRideAPI,
    updateRideAPI,
    deleteRideAPI,
    bookSeatAPI,
    getMyBookingsAPI,
    cancelBookingAPI,
    requestRideAPI,
    getPendingRequestsAPI,
    getMyRideRequestsAPI,
    acceptRideRequestAPI,
    cancelRideRequestAPI
} from '../../services/api';


export const fetchRides = createAsyncThunk(
    'rides/fetchRides',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const response = await getRidesAPI(filters);
            return response.rides;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const fetchRideById = createAsyncThunk(
    'rides/fetchRideById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await getRideByIdAPI(id);
            return response.ride;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createRide = createAsyncThunk(
    'rides/createRide',
    async (rideData, { rejectWithValue }) => {
        try {
            const response = await createRideAPI(rideData);
            return response.ride;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateRide = createAsyncThunk(
    'rides/updateRide',
    async ({ id, rideData }, { rejectWithValue }) => {
        try {
            const response = await updateRideAPI(id, rideData);
            return response.ride;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteRide = createAsyncThunk(
    'rides/deleteRide',
    async (id, { rejectWithValue }) => {
        try {
            await deleteRideAPI(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const bookSeat = createAsyncThunk(
    'rides/bookSeat',
    async ({ rideId, seats }, { rejectWithValue }) => {
        try {
            const response = await bookSeatAPI(rideId, seats);
            return { rideId, booking: response.booking };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMyBookings = createAsyncThunk(
    'rides/fetchMyBookings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getMyBookingsAPI();
            return response.bookings;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const cancelBooking = createAsyncThunk(
    'rides/cancelBooking',
    async ({ rideId, bookingId }, { rejectWithValue }) => {
        try {
            await cancelBookingAPI(rideId, bookingId);
            return { rideId, bookingId };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const requestRide = createAsyncThunk(
    'rides/requestRide',
    async (requestData, { rejectWithValue }) => {
        try {
            const response = await requestRideAPI(requestData);
            return response.request;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPendingRequests = createAsyncThunk(
    'rides/fetchPendingRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getPendingRequestsAPI();
            return response.requests;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMyRideRequests = createAsyncThunk(
    'rides/fetchMyRideRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getMyRideRequestsAPI();
            return response.requests;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const acceptRideRequest = createAsyncThunk(
    'rides/acceptRideRequest',
    async ({ requestId, rideId }, { rejectWithValue }) => {
        try {
            const response = await acceptRideRequestAPI(requestId, rideId);
            return { requestId, booking: response.booking };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const cancelRideRequest = createAsyncThunk(
    'rides/cancelRideRequest',
    async (requestId, { rejectWithValue }) => {
        try {
            await cancelRideRequestAPI(requestId);
            return requestId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const rideSlice = createSlice({
    name: 'rides',
    initialState: {
        rides: [],
        selectedRide: null,
        userBookings: [],
        rideRequests: [],
        pendingRequests: [],
        loading: false,
        error: null,
        filters: {
            pickup: '',
            destination: '',
            date: '',
            seats: ''
        }
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { pickup: '', destination: '', date: '', seats: '' };
        },
        clearRidesError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            //fetch rides
            .addCase(fetchRides.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRides.fulfilled, (state, action) => {
                state.loading = false;
                state.rides = action.payload;
            })
            .addCase(fetchRides.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //fetch ride by id
            .addCase(fetchRideById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRideById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRide = action.payload;
            })
            .addCase(fetchRideById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //create ride
            .addCase(createRide.fulfilled, (state, action) => {
                state.rides.unshift(action.payload);
            })
            //update ride
            .addCase(updateRide.fulfilled, (state, action) => {
                const index = state.rides.findIndex(r => r._id === action.payload._id);
                if (index !== -1) state.rides[index] = action.payload;
                if (state.selectedRide?._id === action.payload._id) state.selectedRide = action.payload;
            })
            //delete ride
            .addCase(deleteRide.fulfilled, (state, action) => {
                state.rides = state.rides.filter(r => r._id !== action.payload);
                if (state.selectedRide?._id === action.payload) state.selectedRide = null;
            })
            //book seat
            .addCase(bookSeat.fulfilled, (state, action) => {
                const ride = state.rides.find(r => r._id === action.payload.rideId);
                if (ride) ride.availableSeats -= 1;
            })
            //fetch my bookings
            .addCase(fetchMyBookings.fulfilled, (state, action) => {
                state.userBookings = action.payload;
            })
            //cancel booking
            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.userBookings = state.userBookings.filter(
                    b => !(b.rideId === action.payload.rideId && b.id === action.payload.bookingId)
                );
                const ride = state.rides.find(r => r._id === action.payload.rideId);
                if (ride) ride.availableSeats += 1;
            })
            .addCase(requestRide.fulfilled, (state, action) => {
                state.rideRequests.unshift(action.payload);
            })
            // Fetch pending requests
            .addCase(fetchPendingRequests.fulfilled, (state, action) => {
                state.pendingRequests = action.payload;
            })
            // Fetch my requests
            .addCase(fetchMyRideRequests.fulfilled, (state, action) => {
                state.rideRequests = action.payload;
            })
            // Accept request
            .addCase(acceptRideRequest.fulfilled, (state, action) => {
                state.pendingRequests = state.pendingRequests.filter(r => r.id !== action.payload.requestId);
                // Also update booking in userBookings
            })
            // Cancel request
            .addCase(cancelRideRequest.fulfilled, (state, action) => {
                state.rideRequests = state.rideRequests.filter(r => r.id !== action.payload);
                state.pendingRequests = state.pendingRequests.filter(r => r.id !== action.payload);
            });


    }
});

export const { setFilters, clearFilters, clearRidesError } = rideSlice.actions;
export const selectAllRides = (state) => state.rides.rides;
export const selectSelectedRide = (state) => state.rides.selectedRide;
export const selectUserBookings = (state) => state.rides.userBookings;
export const selectRidesLoading = (state) => state.rides.loading;
export const selectRidesError = (state) => state.rides.error;
export const selectRideFilters = (state) => state.rides.filters;
export const selectPendingRequests = (state) => state.rides.pendingRequests;
export const selectMyRideRequests = (state) => state.rides.rideRequests;
export const selectFilteredRides = (state) => {
    const { rides, filters } = state.rides;
    return rides.filter(ride => {
        if (filters.pickup && !ride.pickup.toLowerCase().includes(filters.pickup.toLowerCase())) return false;
        if (filters.destination && !ride.destination.toLowerCase().includes(filters.destination.toLowerCase())) return false;
        if (filters.date && ride.date !== filters.date) return false;
        if (filters.seats && ride.availableSeats < parseInt(filters.seats)) return false;
        return true;
    });
};
export const selectRideById = (rideId) => (state) => 
    state.rides.rides.find(ride => ride._id === rideId || ride.id === rideId);
export default rideSlice.reducer;