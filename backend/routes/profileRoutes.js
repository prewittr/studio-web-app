const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

router.get('/', authenticateJWT, getProfile);
router.put('/', authenticateJWT, updateProfile);

module.exports = router;
