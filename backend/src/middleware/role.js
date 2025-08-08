/**
 * Factory function to authorize a user based on allowed roles. It assumes
 * that the `req.user` object has been populated by the authentication
 * middleware. If the user's role is not included in the allowed roles, a
 * 403 forbidden response is returned.
 *
 * @param {string[]} roles - List of permitted user roles
 */
exports.authorize = (roles = []) => {
  // Ensure roles is an array
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
  };
};