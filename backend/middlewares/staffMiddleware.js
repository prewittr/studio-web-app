module.exports = (req, res, next) => {
    // Assuming the authentication middleware has set req.user
    if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
      return next();
    }
    return res.status(403).json({ message: 'Access denied: staff only.' });
  };
  