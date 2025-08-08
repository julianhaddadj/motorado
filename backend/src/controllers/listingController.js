const Listing = require('../models/Listing');

/**
 * Create a new car listing. Requires authentication and uses the upload
 * middleware to handle image uploads. All listings are marked as `Pending`
 * until an admin approves them. The seller's role and sellerType are
 * derived from the authenticated user.
 */
exports.createListing = async (req, res) => {
  try {
    const {
      title,
      make,
      model,
      year,
      price,
      mileage,
      engine,
      transmission,
      color,
      bodyType,
      location,
      description,
    } = req.body;
    if (!title || !make || !model || !year || !price || !mileage || !location) {
      return res.status(400).json({ message: 'Missing required listing fields' });
    }
    // Map uploaded files to objects containing URL and key
    const images = (req.files || []).map((file) => ({ url: file.location, key: file.key }));
    const listing = new Listing({
      title,
      make,
      model,
      year,
      price,
      mileage,
      engine,
      transmission,
      color,
      bodyType,
      location,
      description,
      seller: req.user._id,
      sellerType: req.user.sellerType || 'individual',
      images,
      status: 'Pending',
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create listing' });
  }
};

/**
 * Retrieve all listings visible to the public. Supports query parameters for
 * filtering and sorting. Only listings with status `Approved` are returned
 * unless the requester is an admin or the seller of the listing. Query
 * parameters supported: make, model, minPrice, maxPrice, minYear, maxYear,
 * mileage, city (location), bodyType, color, sellerType, sort (recent,
 * priceLowHigh, priceHighLow).
 */
exports.getListings = async (req, res) => {
  try {
    const query = {};
    const {
      make,
      model,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      mileage,
      location,
      bodyType,
      color,
      sellerType,
    } = req.query;
    if (make) query.make = make;
    if (model) query.model = model;
    if (sellerType) query.sellerType = sellerType;
    if (bodyType) query.bodyType = bodyType;
    if (color) query.color = color;
    if (location) query.location = location;
    if (mileage) query.mileage = { $lte: Number(mileage) };
    if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = Number(minYear);
      if (maxYear) query.year.$lte = Number(maxYear);
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    // Only show approved listings by default unless user is admin
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'Approved';
    }
    let mongoQuery = Listing.find(query).populate('seller', 'name sellerType phoneNumber');
    // Sorting
    const { sort } = req.query;
    if (sort === 'priceLowHigh') {
      mongoQuery = mongoQuery.sort({ price: 1 });
    } else if (sort === 'priceHighLow') {
      mongoQuery = mongoQuery.sort({ price: -1 });
    } else {
      // default sort by most recent
      mongoQuery = mongoQuery.sort({ createdAt: -1 });
    }
    const listings = await mongoQuery.exec();
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
};

/**
 * Get a single listing by ID. If the listing is not approved and the
 * requester is neither the seller nor an admin, a 403 is returned.
 */
exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('seller', 'name sellerType phoneNumber');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (listing.status !== 'Approved') {
      const isSeller = req.user && req.user._id && listing.seller._id.equals(req.user._id);
      const isAdmin = req.user && req.user.role === 'admin';
      if (!isSeller && !isAdmin) {
        return res.status(403).json({ message: 'You are not authorized to view this listing' });
      }
    }
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch listing' });
  }
};

/**
 * Update a listing by ID. Only the seller of the listing or an admin can
 * update it. When a seller updates their own listing, the status resets to
 * `Pending` so it can be re-reviewed by the admin. Admins can update
 * listings without changing the status.
 */
exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    const isSeller = req.user && listing.seller.equals(req.user._id);
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isSeller && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    // Update fields; only update allowed fields
    const fields = [
      'title',
      'make',
      'model',
      'year',
      'price',
      'mileage',
      'engine',
      'transmission',
      'color',
      'bodyType',
      'location',
      'description',
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });
    // If new images uploaded, replace the images array
    if (req.files && req.files.length > 0) {
      listing.images = req.files.map((file) => ({ url: file.location, key: file.key }));
    }
    // If seller updating, reset status to Pending
    if (isSeller && !isAdmin) {
      listing.status = 'Pending';
    }
    await listing.save();
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update listing' });
  }
};

/**
 * Delete a listing. Only the seller or an admin can delete a listing.
 */
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    const isSeller = req.user && listing.seller.equals(req.user._id);
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isSeller && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete listing' });
  }
};