const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, default: '' },
  company: { type: String, default: '' },
  location: { type: String, default: '' },
  tags: { type: [String], default: [] },
  salary: { type: String, default: '' },
  vacancy: { type: Number, default: 1 },
  startDate: { type: Date },
  endDate: { type: Date },
  postedBy: { type: String, default: '' }, // employer email or id
  postedAt: { type: Date, default: Date.now }
});

// Text index for search across title, description, company, tags
JobSchema.index({ title: 'text', description: 'text', company: 'text', tags: 'text' });

module.exports = mongoose.model('Job', JobSchema);
