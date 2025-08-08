const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Optional authentication middleware. If a Bearer token is provided in the
 * Authorization header it will attempt to verify the token and attach the
 * user to the request object. If verification fails, the request continues
 * without authentication.
 */
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (err) {
      // Ignore errors and proceed without attaching user
    }
  }
  next();
};