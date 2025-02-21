// backend/routes/membershipsRoutes.js
const express = require('express');
const router = express.Router();
const { purchaseMembership } = require('../controllers/membershipsController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

router.post('/purchase', authenticateJWT, purchaseMembership);

module.exports = router;
