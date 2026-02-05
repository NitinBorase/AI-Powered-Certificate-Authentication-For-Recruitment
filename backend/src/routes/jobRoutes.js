const express = require('express');
const router = express.Router();
const { createJob, searchJobs, getJob } = require('../controllers/jobControllers');

// Create a new job (employer)
router.post('/', createJob);

// Search jobs (applicants)
router.get('/', searchJobs);

// Get job details
router.get('/:id', getJob);

module.exports = router;
