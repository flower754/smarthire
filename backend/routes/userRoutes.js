const express = require('express');
const router = express.Router();
const { getMe, updateProfile, getCandidates } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here require being logged in
router.use(protect); 

router.get('/me', getMe);
router.put('/update', updateProfile);

// Only recruiters can see the list of candidates
router.get('/candidates', authorize('recruiter'), getCandidates);

module.exports = router;