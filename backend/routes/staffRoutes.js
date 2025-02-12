const express = require('express');
const router = express.Router();
const { getAllBookings } = require('../controllers/sessionsController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const staffMiddleware = require('../middlewares/staffMiddleware');

router.get('/bookings', authenticateJWT, staffMiddleware, getAllBookings);

module.exports = router;
