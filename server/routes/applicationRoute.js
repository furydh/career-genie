const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getMyApplications, applyToJob } = require('../controllers/applicationController');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // or your preferred storage

router.get('/applications/mine', authenticateToken, authorizeRoles('student'), getMyApplications);
router.post(
  '/applications',
  authenticateToken,
  authorizeRoles('student'),
  upload.single('resume'), // Accept resume file
  applyToJob
);

module.exports = router;
