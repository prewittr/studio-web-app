const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/stripeController'); // Import
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16; custom_checkout_beta=v1;',
  });

  router.post('/create-checkout-session', createCheckoutSession); 

module.exports = router;