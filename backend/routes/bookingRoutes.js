const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Create a new booking
router.post('/', authenticateJWT, bookingController.createBooking);

// Get all bookings for the authenticated user
router.get('/', authenticateJWT, bookingController.getBookings);

// Update a booking
router.put('/:id', authenticateJWT, bookingController.updateBooking);

//Cancel a Booking
router.delete('/:id', authenticateJWT, bookingController.cancelBooking);

// Optionally, add additional routes for updating or canceling a booking
// router.put('/:id', authenticateJWT, bookingController.updateBooking);
// router.delete('/:id', authenticateJWT, bookingController.cancelBooking);

module.exports = router;
