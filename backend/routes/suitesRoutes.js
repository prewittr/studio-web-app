// backend/routes/suitesRoutes.js
const express = require('express');
const router = express.Router();
const { getSaunaSuites, getRedlightSuites } = require('../controllers/suitesController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Endpoint to get available sauna suites
router.get('/sauna', authenticateJWT, getSaunaSuites);

// Endpoint to get available red light bed suites
router.get('/redlight', authenticateJWT, getRedlightSuites);

module.exports = router;
