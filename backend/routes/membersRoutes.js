const express = require('express');
const router = express.Router();
const { getMemberDashboard } = require('../controllers/membersController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

router.get('/dashboard', authenticateJWT, getMemberDashboard);

module.exports = router;
