const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');

// You might later add spam protection (e.g., reCAPTCHA) here.
router.post('/', submitContactForm);

module.exports = router;
