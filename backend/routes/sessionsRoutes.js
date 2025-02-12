const express = require('express');
const router = express.Router();
const { bookSession, getMyBookings, getAvailability, cancelSession } = require('../controllers/sessionsController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const { updateSession } = require('../controllers/sessionsController');



// Endpoint to book a session
router.post('/book', authenticateJWT, bookSession);

// Endpoint to fetch the member's bookings
router.get('/myBookings', authenticateJWT, getMyBookings);

// Endpoint to fetch equipment availability
router.get('/availability', authenticateJWT, getAvailability);

// Endpoint to delete a session
router.delete('/:id/cancel', authenticateJWT, cancelSession);

// Endpoint to update a booked
router.put('/:id', authenticateJWT, updateSession);

module.exports = router;
