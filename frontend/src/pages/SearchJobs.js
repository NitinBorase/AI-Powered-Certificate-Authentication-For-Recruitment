import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';

export default function SearchJobs() {
  const [q, setQ] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');

  const search = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs?q=${encodeURIComponent(q)}`);
      const items = Array.isArray(res.data) ? res.data : (res.data.jobs || res.data.data || res.data);
      setJobs(items || []);
    } catch (err) {
      console.error('Search error', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (job) => setSelectedJob(job);
  const closeDetail = () => {
    setSelectedJob(null);
    setApplyMessage('');
  };

  const handleApply = async (job) => {
    const email = localStorage.getItem('userEmail');
    const resumeUrl = localStorage.getItem('resumeUrl') || '';
    if (!email) return alert('Please login as applicant to apply');

    setApplying(true);
    setApplyMessage('');
    try {
      const res = await axios.post(`http://localhost:5000/api/jobs/${job._id || job.id}/apply`, {
        applicantEmail: email,
        resumeUrl,
      });

      if (res.data && res.data.success) {
        setApplyMessage('Application submitted successfully.');
      } else {
        setApplyMessage(res.data?.message || 'Application request sent');
      }
    } catch (err) {
      console.error('Apply error', err);
      const msg = err.response?.data?.message || err.message || 'Failed to apply';
      setApplyMessage(`Error: ${msg}`);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Search Jobs</h2>
        <SearchBar value={q} onChange={setQ} onSearch={search} />

        {loading && <div className="mt-4 text-sm text-gray-500">Loading...</div>}
        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        <div className="space-y-4 mt-6">
          {jobs.length === 0 && !loading ? (
            <div className="text-gray-500">No jobs found. Try a different search term.</div>
          ) : (
            jobs.map(job => (
              <JobCard key={job._id || job.id || job.title} job={job} onOpen={openDetail} onApply={handleApply} />
            ))
          )}
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-2xl w-full p-6 rounded-md shadow-lg">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">{selectedJob.title}</h3>
              <button onClick={closeDetail} className="text-gray-500">Close</button>
            </div>
            <div className="mt-2 text-sm text-gray-600">{selectedJob.company} • {selectedJob.location}</div>
            <div className="mt-4 text-gray-800">{selectedJob.description}</div>

            <div className="mt-4 flex items-center space-x-2">
              <button onClick={() => handleApply(selectedJob)} disabled={applying} className="px-4 py-2 bg-blue-600 text-white rounded">
                {applying ? 'Applying...' : 'Apply'}
              </button>
              <button onClick={closeDetail} className="px-4 py-2 bg-gray-200 rounded">Close</button>
            </div>

            {applyMessage && <div className="mt-3 text-sm text-green-600">{applyMessage}</div>}
          </div>
        </div>
      )}
    </div>
  );
}






