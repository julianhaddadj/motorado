const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { protect } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const upload = require('../middleware/upload');

// Public: get listings with filters and sorts. Attach user if provided.
router.get('/', optionalAuth, listingController.getListings);

// Public: get listing by ID; attach user if token is provided
router.get('/:id', optionalAuth, listingController.getListingById);

// Create a new listing; requires authentication
router.post('/', protect, upload.array('images', 8), listingController.createListing);

// Update an existing listing; requires authentication
router.put('/:id', protect, upload.array('images', 8), listingController.updateListing);

// Delete a listing; requires authentication
router.delete('/:id', protect, listingController.deleteListing);

module.exports = router;