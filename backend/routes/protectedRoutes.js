const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Protected welcome route
router.get('/welcome', authenticateJWT, (req, res) => {
  // If the token contains a username, use it; otherwise, fallback to the user ID.
  const username = req.user.username || req.user.id;
  res.json({ message: `Welcome, ${username}!` });
});

module.exports = router;
