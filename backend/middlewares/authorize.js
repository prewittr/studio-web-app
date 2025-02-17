// /middlewares/authorize.js

/**
 * Middleware to allow only staff and admin users to proceed.
 */
module.exports.authorizeStaff = (req, res, next) => {
    if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
      return next();
    }
    return res.status(403).json({ message: 'Access denied. Staff only.' });
  };
  
  /**
   * Middleware to allow only admin users to proceed.
   */
  module.exports.authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  };
  