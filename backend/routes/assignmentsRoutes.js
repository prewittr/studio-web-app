const express = require('express');
const router = express.Router();
const { getSuiteAssignments } = require('../controllers/assignmentsController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const staffMiddleware = require('../middlewares/staffMiddleware');

router.get('/assignments', authenticateJWT, staffMiddleware, getSuiteAssignments);

module.exports = router;
