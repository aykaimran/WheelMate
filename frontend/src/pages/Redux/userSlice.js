import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    registerUserAPI, 
    loginUserAPI, 
    logoutUserAPI, 
    changePasswordAPI, 
    getCurrentUserAPI 
} from '../../services/api';

//async thunks using fetch
export const register = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await registerUserAPI(userData);
            localStorage.setItem('token', response.token);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const login = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginUserAPI(credentials);
            localStorage.setItem('token', response.token);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logout = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            await logoutUserAPI();
            localStorage.removeItem('token');
            return {};
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



export const changePassword = createAsyncThunk(
    'user/changePassword',
    async ({ currentPassword, newPassword }, { rejectWithValue }) => {
        try {
            const response = await changePasswordAPI({ currentPassword, newPassword });
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCurrentUserAPI();
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        isLoggedIn: !!localStorage.getItem('token'),
        loading: false,
        error: null,
        passwordChangeSuccess: false
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearPasswordChangeSuccess: (state) => {
            state.passwordChangeSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            //register here
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload.user;
                state.isLoggedIn = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isLoggedIn = false;
            })

            //login here
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload.user;
                state.isLoggedIn = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isLoggedIn = false;
            })
            //logout
            .addCase(logout.fulfilled, (state) => {
                state.currentUser = null;
                state.isLoggedIn = false;
            })
            //change password
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.passwordChangeSuccess = false;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
                state.passwordChangeSuccess = true;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.passwordChangeSuccess = false;
            })
            // fetch current user
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
                state.isLoggedIn = true;
            });
    }
});

export const { clearError, clearPasswordChangeSuccess } = userSlice.actions;
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectPasswordChangeSuccess = (state) => state.user.passwordChangeSuccess;

export default userSlice.reducer;