const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Get all listings (admin)
router.get('/listings', protect, authorize('admin'), adminController.getAllListings);

// Approve a listing
router.put('/listings/:id/approve', protect, authorize('admin'), adminController.approveListing);

// Reject a listing
router.put('/listings/:id/reject', protect, authorize('admin'), adminController.rejectListing);

// Delete a listing
router.delete('/listings/:id', protect, authorize('admin'), adminController.deleteListing);

// Get users
router.get('/users', protect, authorize('admin'), adminController.getUsers);

module.exports = router;