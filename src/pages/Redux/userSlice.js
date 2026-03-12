import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        isLoggedIn: false,
        userProfiles: {},
        error: null
    },

    reducers: {
        registerUser: (state, action) => {
            const newUser = {
                email: action.payload.email,
                password: action.payload.password,
                name: action.payload.name || ''
            }

            if (state.userProfiles[newUser.email]) {
                state.error = 'User already exists'
            } else {
                state.userProfiles[newUser.email] = newUser
                state.error = null
            }
        },

        login: (state, action) => {
            const { email, password } = action.payload
            const user = Object.values(state.userProfiles).find(
                u => u.email === email && u.password === password
            )
            if (user) {
                state.currentUser = user
                state.isLoggedIn = true
                state.error = null
            } else {
                state.isLoggedIn = false
                state.currentUser = null
                state.error = 'Invalid email or password'
            }
        },

        logout: (state) => {
            state.currentUser = null
            state.isLoggedIn = false
            state.error = null
        },

        changepassword: (state, action) => {
            const { email, oldPassword, newPassword } = action.payload  // Use email, not useremail

            const user = state.userProfiles[email]
            if (user) {
                if (user.password === oldPassword) {
                    user.password = newPassword
                    if (state.currentUser?.email === email) {
                        state.currentUser.password = newPassword
                    }
                    state.error = null
                } else {
                    state.error = 'Old password is incorrect'
                }
            } else {
                state.error = 'User not found'
            }
        },

        storeUserProfile: (state, action) => {
            const { email, profileData } = action.payload
            if (!state.userProfiles[email]) {
                state.userProfiles[email] = {}
            }
            state.userProfiles[email] = {
                ...state.userProfiles[email],
                ...profileData
            }
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearError: (state) => {
            state.error = null
        }
    }
})

export const {
    registerUser,
    login,
    logout,
    changepassword,
    storeUserProfile,
    setError,
    clearError
} = userSlice.actions

//selectors
export const selectCurrentUser = (state) => state.user.currentUser
export const selectIsLoggedIn = (state) => state.user.isLoggedIn
export const selectUserProfile = (useremail) => (state) => state.user.userProfiles[useremail]
export const selectUserError = (state) => state.user.error

export default userSlice.reducer