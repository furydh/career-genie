const express = require('express');
const { getMyJobs } = require('../controllers/jobController');
const { createJob } = require('../controllers/jobController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getApplicants } = require('../controllers/jobController');
const { getAllJobs } = require('../controllers/jobController');
const { acceptApplication } = require('../controllers/jobController');
const router = express.Router();

router.get('/jobs/my', authenticateToken, authorizeRoles('recruiter', 'admin'), getMyJobs);
router.post('/jobs', authenticateToken, authorizeRoles('recruiter', 'admin'), createJob);
router.get('/jobs/:jobId/applicants', authenticateToken, authorizeRoles('recruiter', 'admin'), getApplicants);
router.get('/jobs', getAllJobs);
router.patch(
  '/applications/:applicationId/accept',
  authenticateToken,
  authorizeRoles('recruiter', 'admin'),
  acceptApplication
);
module.exports = router;