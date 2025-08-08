const Listing = require('../models/Listing');
const User = require('../models/User');

/**
 * Retrieve all listings regardless of status. Admin can optionally filter
 * by status using the `status` query parameter. Populates seller information.
 */
exports.getAllListings = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;
    const listings = await Listing.find(query)
      .populate('seller', 'name sellerType email phoneNumber')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
};

/**
 * Approve a listing by ID. Sets the status to `Approved`.
 */
exports.approveListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    listing.status = 'Approved';
    await listing.save();
    res.json({ message: 'Listing approved', listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to approve listing' });
  }
};

/**
 * Reject a listing by ID. Sets the status to `Rejected`.
 */
exports.rejectListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    listing.status = 'Rejected';
    await listing.save();
    res.json({ message: 'Listing rejected', listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reject listing' });
  }
};

/**
 * Delete a listing by ID. Provided for admin convenience.
 */
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete listing' });
  }
};

/**
 * Retrieve all users. Admin can specify a role filter via the `role` query
 * parameter.
 */
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role) query.role = role;
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};