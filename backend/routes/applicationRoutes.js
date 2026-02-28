const express = require('express');
const router = express.Router();

// FIX: Added 'updateStatus' to this import line
const { applyToJob, getJobApplications, updateStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../services/uploadService'); 

// The 'resume' string here must match the key used in Postman/Frontend
router.post('/:jobId', protect, authorize('candidate'), upload.single('resume'), applyToJob);

// Recruiter gets all applications for their job
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplications);

// Recruiter updates the status of an application (Accept/Reject)
router.put('/:id', protect, authorize('recruiter'), updateStatus);

module.exports = router;