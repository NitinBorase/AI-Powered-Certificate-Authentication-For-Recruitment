import React from 'react';

export default function SearchBar({ value, onChange, onSearch, placeholder = 'Search jobs (e.g. Java Developer)' }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') onSearch(); }}
        placeholder={placeholder}
        className="flex-grow p-2 border rounded-md"
      />
      <button onClick={onSearch} className="px-4 py-2 bg-blue-600 text-white rounded-md">Search</button>
    </div>
  );
}
