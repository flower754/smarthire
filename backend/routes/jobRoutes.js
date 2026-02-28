const express = require('express');
const router = express.Router();

// 1. Import all necessary functions from the controller
const { 
  createJob, 
  getJobs, 
  deleteJob, 
  updateJob,
  getJob
} = require('../controllers/jobController');

// 2. Import your protection and authorization middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// --- ROUTES ---

// @route   /api/jobs
router.route('/')
  .get(getJobs) // Get all jobs
  .post(protect, authorize('recruiter'), createJob); // Removed the extra .get here

// @route   /api/jobs/:id
router.route('/:id')
  .get(getJob) // Fixed: Chained correctly without a semicolon before it
  .delete(protect, authorize('recruiter'), deleteJob)
  .put(protect, authorize('recruiter'), updateJob);

module.exports = router;