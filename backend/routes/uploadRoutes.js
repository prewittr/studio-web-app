const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadProfilePicture } = require('../controllers/uploadController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Use multer memory storage instead of disk storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Protect the route with your authentication middleware
router.post('/', authenticateJWT, upload.single('file'), uploadProfilePicture);

module.exports = router;
