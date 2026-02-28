const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  // ADD THESE TWO FIELDS:
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  salary: {
    type: String
  },
  // Add this to your JobSchema in models/Job.js
requirements: {
  type: [String], // This allows us to store a list of strings
  default: []
},
  recruiter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  
});

module.exports = mongoose.model('Job', JobSchema);