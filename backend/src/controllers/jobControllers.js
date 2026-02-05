const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    console.log('Create job request received from', req.ip || req.headers['x-forwarded-for'] || 'unknown', 'body:', req.body);
    const { title, company } = req.body;
    if (!title || !company) {
      return res.status(400).json({ success: false, message: 'Title and company are required' });
    }

    const jobData = {
      title: req.body.title,
      description: req.body.description || '',
      company: req.body.company || '',
      location: req.body.location || '',
      tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : []),
      salary: req.body.salary || '',
      vacancy: req.body.vacancy ? parseInt(req.body.vacancy, 10) : 1,
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      postedBy: req.body.postedBy || ''
    };

    const job = await Job.create(jobData);
    console.log('New job posted:', { id: job._id, title: job.title, company: job.company, postedBy: job.postedBy });
    res.status(201).json({ success: true, job });
  } catch (err) {
    console.error('Error creating job:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.searchJobs = async (req, res) => {
  try {
    const { q = '', location, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (location) filter.location = { $regex: location, $options: 'i' };

    let jobsQuery;
    if (q) {
      // Use $text search (Job model has a text index on title/description/company/tags)
      filter.$text = { $search: q };
      jobsQuery = Job.find(filter, { score: { $meta: 'textScore' } });
      // sort by relevance first, then by newest
      jobsQuery = jobsQuery.sort({ score: { $meta: 'textScore' }, postedAt: -1 });
    } else {
      jobsQuery = Job.find(filter).sort({ postedAt: -1 });
    }

    const jobs = await jobsQuery
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    console.error('Error searching jobs:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (err) {
    console.error('Error fetching job:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
