const User = require('../models/User');

/**
 * Register a new user account. Accepts `name`, `email`, `password`,
 * `sellerType` (optional) and creates a new user in the database. By default
 * the role is set to `buyer`, but if a seller type is provided the role is
 * changed to `seller`. Returns a JWT token and the user profile.
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, sellerType, phoneNumber } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const user = new User({
      name,
      email,
      password,
      phoneNumber,
      sellerType: sellerType || 'individual',
    });
    if (sellerType) {
      user.role = 'seller';
    }
    await user.save();
    const token = user.generateJWT();
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, sellerType: user.sellerType } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * Authenticate a user with email and password. If credentials are valid
 * returns a JWT token and the user profile.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = user.generateJWT();
    const { _id, name, role, sellerType } = user;
    res.json({ token, user: { id: _id, name, email: user.email, role, sellerType } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * Get the authenticated user's profile. Assumes the authentication
 * middleware has populated `req.user`. Returns the user information
 * excluding the password field.
 */
exports.getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json(req.user);
};

/**
 * Add a listing to the user's favorites. Requires authentication.
 */
exports.addFavorite = async (req, res) => {
  const { listingId } = req.params;
  try {
    if (!req.user.favorites.includes(listingId)) {
      req.user.favorites.push(listingId);
      await req.user.save();
    }
    res.json({ favorites: req.user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add favorite' });
  }
};

/**
 * Remove a listing from the user's favorites. Requires authentication.
 */
exports.removeFavorite = async (req, res) => {
  const { listingId } = req.params;
  try {
    req.user.favorites = req.user.favorites.filter((fav) => fav.toString() !== listingId);
    await req.user.save();
    res.json({ favorites: req.user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
};