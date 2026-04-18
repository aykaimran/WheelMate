const API_URL = 'http://localhost:5000/api';

const apiRequest = async (endpoint, method = 'GET', body = null, requiresAuth = false) => {
    const url = `${API_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (requiresAuth) { //authorization token
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    const options = {
        method,
        headers,
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

//AUTH ENDPOINTS HERE 

//register user
export const registerUserAPI = async (userData) => {
    return await apiRequest('/auth/register', 'POST', userData, false);
};

//login user
export const loginUserAPI = async (credentials) => {
    return await apiRequest('/auth/login', 'POST', credentials, false);
};

//logout user
export const logoutUserAPI = async () => {
    return await apiRequest('/auth/logout', 'POST', null, true);
};

// change password
export const changePasswordAPI = async (passwords) => {
    return await apiRequest('/auth/changepassword', 'PUT', passwords, true);
};

//get current user
export const getCurrentUserAPI = async () => {
    return await apiRequest('/auth/me', 'GET', null, true);
};

// RIDE ENDPOINTS HERE

//get all rides with filters
export const getRidesAPI = async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/rides?${queryParams}` : '/rides';
    return await apiRequest(endpoint, 'GET', null, false);
};

//get single ride by ID
export const getRideByIdAPI = async (id) => {
    return await apiRequest(`/rides/${id}`, 'GET', null, false);
};

//create a new ride (requires auth)
export const createRideAPI = async (rideData) => {
    return await apiRequest('/rides', 'POST', rideData, true);
};

//update a ride (requires auth)
export const updateRideAPI = async (id, rideData) => {
    return await apiRequest(`/rides/${id}`, 'PUT', rideData, true);
};

//delete a ride (requires auth)
export const deleteRideAPI = async (id) => {
    return await apiRequest(`/rides/${id}`, 'DELETE', null, true);
};

//BOOKING ENDPOINTS HERE

//book a seat on a ride (requires auth)
export const bookSeatAPI = async (rideId, seats) => {
    return await apiRequest(`/bookings/${rideId}/book`, 'POST', { seats }, true);
};

//get user's bookings (requires auth)
export const getMyBookingsAPI = async () => {
    return await apiRequest('/bookings/mybookings', 'GET', null, true);
};

//cancel a booking (requires auth)
export const cancelBookingAPI = async (rideId, bookingId) => {
    return await apiRequest(`/bookings/${rideId}/${bookingId}`, 'DELETE', null, true);
};


export const requestRideAPI = async (requestData) => {
    return await apiRequest('/rides/request', 'POST', requestData, true);
};

export const getPendingRequestsAPI = async () => {
    return await apiRequest('/rides/requests/pending', 'GET', null, true);
};

export const getMyRideRequestsAPI = async () => {
    return await apiRequest('/rides/myrequests', 'GET', null, true);
};

export const acceptRideRequestAPI = async (requestId, rideId) => {
    return await apiRequest(`/rides/requests/${requestId}/accept`, 'PUT', { rideId }, true);
};

export const cancelRideRequestAPI = async (requestId) => {
    return await apiRequest(`/rides/requests/${requestId}`, 'DELETE', null, true);
};