import React from 'react';

export default function JobCard({ job, onOpen, onApply }) {
  const postedAt = job.postedAt ? new Date(job.postedAt).toLocaleDateString() : '';
  const tags = job.tags && Array.isArray(job.tags) ? job.tags.join(', ') : job.tags || '';

  return (
    <div className="p-4 bg-white rounded-lg shadow border flex flex-col md:flex-row justify-between items-start md:items-center">
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
          <div className="text-sm text-gray-500">{postedAt}</div>
        </div>
        <div className="text-sm text-gray-600">{job.company} • {job.location}</div>
        <div className="mt-2 text-sm text-gray-700 truncate">{job.description ? job.description.slice(0, 180) : ''}</div>
        {tags && <div className="mt-2 text-xs text-gray-500">Tags: {tags}</div>}
      </div>

      <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0 flex items-center space-x-2">
        <button onClick={() => onOpen && onOpen(job)} className="px-3 py-2 bg-gray-100 rounded">View</button>
        <button onClick={() => onApply && onApply(job)} className="px-3 py-2 bg-blue-600 text-white rounded">Apply</button>
      </div>
    </div>
  );
}
