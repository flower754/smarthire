const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate only)
exports.applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      job: req.params.jobId,
      candidate: req.user.id
    });

    if (alreadyApplied) {
      return res.status(400).json({ success: false, error: 'Already applied for this job' });
    }

    const application = await Application.create({
      job: req.params.jobId,
      candidate: req.user.id,
      resume: req.file ? req.file.filename : req.body.resume 
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get applications for a recruiter's job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only)
exports.getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email');

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update application status (Accept/Reject)
// @route   PUT /api/applications/:id
// @access  Private (Recruiter only)
exports.updateStatus = async (req, res) => {
  try {
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    application = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};