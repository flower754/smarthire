const User = require('../models/User');

// @desc    Get current logged in user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // req.user.id comes from the protect middleware
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/update
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email
      // You can add bio, skills, etc., here later
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all candidates (for Recruiters)
// @route   GET /api/users/candidates
// @access  Private/Recruiter
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await User.find({ role: 'candidate' });
    
    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};