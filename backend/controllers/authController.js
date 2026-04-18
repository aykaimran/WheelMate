const User = require('../models/User');
const jwt = require('jsonwebtoken');

//Generating JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

//register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists' 
            });
        }
        
        // Create user
        const user = await User.create({ name, email, password });
        
        const token = generateToken(user._id);
        
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

//login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        const token = generateToken(user._id);
        
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

//change password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }
        
        user.password = newPassword;
        await user.save();
        
        //generate new token after password change
        const token = generateToken(user._id);
        
        res.json({
            success: true,
            message: 'Password changed successfully',
            token
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get current user details
const getCurrentUser = async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
};

// Logout user (for JWT, this is handled on the client side by deleting the token)
const logoutUser = (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};

module.exports = {
    registerUser,
    loginUser,
    changePassword,
    getCurrentUser,
    logoutUser
};