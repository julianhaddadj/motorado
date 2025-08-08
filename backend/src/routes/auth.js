const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register a new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get current user profile
router.get('/me', protect, authController.getMe);

// Add a listing to favorites
router.post('/favorites/:listingId', protect, authController.addFavorite);

// Remove a listing from favorites
router.delete('/favorites/:listingId', protect, authController.removeFavorite);

module.exports = router;