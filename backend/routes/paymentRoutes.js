const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/paymentController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Create a new payment intent (secure endpoint)
router.post('/create-intent', authenticateJWT, createPaymentIntent);

module.exports = router;
