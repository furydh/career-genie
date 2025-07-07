const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getMyApplications } = require('../controllers/applicationController');
const router = express.Router();

router.get('/applications/mine', authenticateToken, authorizeRoles('student'), getMyApplications);

module.exports = router;
