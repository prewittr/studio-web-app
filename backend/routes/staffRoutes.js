const express = require('express');
const router = express.Router();
const { getAllBookings } = require('../controllers/sessionsController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const staffMiddleware = require('../middlewares/staffMiddleware');
const { getBookingById, updateBooking, cancelBooking } = require('../controllers/staffController');
const { authorizeStaff } = require('../middlewares/authorize');
const { staffCheckInBooking } = require('../controllers/staffController');

// List all bookings (staff view)
router.get('/bookings', authenticateJWT, staffMiddleware, getAllBookings);

// Get a single booking by ID (staff only)
router.get('/bookings/:id', authenticateJWT, authorizeStaff, getBookingById);

// Update booking (staff only)
router.put('/bookings/:id', authenticateJWT, authorizeStaff, updateBooking);

// Cancel booking (staff only)
router.delete('/bookings/:id', authenticateJWT, authorizeStaff, cancelBooking);

//Staff manual check-in endpoint
router.post('/bookings/:id/checkin', authenticateJWT, authorizeStaff, staffCheckInBooking);

module.exports = router;
