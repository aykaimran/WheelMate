const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    changePassword,
    getCurrentUser,
    logoutUser
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
console.log('registerUser:', registerUser);
// router.post('/register', registerUser);

router.post('/register',  registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getCurrentUser);
router.put('/changepassword', protect, changePassword);

module.exports = router;