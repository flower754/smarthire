const Job = require('../models/Job');

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    // 1. Log what is coming in to your VS Code terminal
    console.log("Request Body:", req.body);
    console.log("User ID from Middleware:", req.user?.id);

    // 2. Explicitly build the object to ensure required fields are present
    const { title, description, company, location, salary } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      recruiter: req.user.id // Ensure this matches your 'protect' middleware
    });

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (err) {
    // 3. Print the REAL error to your terminal so you don't have to guess
    console.error("MongoDB Error:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
};
// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if the recruiter owns the job
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await job.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};