import React, { useState } from 'react';
import { UserCircle, Bell, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const initialJobPosts = [
  {
    id: 'jd001',
    jobRole: 'Java Developer',
    vacancy: 2,
    startDate: '12/09/2025',
    endDate: '12/10/2025',
  },
  {
    id: 'fd002',
    jobRole: 'Frontend Developer',
    vacancy: 1,
    startDate: '02/10/2025',
    endDate: '12/10/2025',
  },
];

const JobCard = ({ job, onDelete }) => {
  const { id, jobRole, vacancy, startDate, endDate } = job;

  const handleGetApplicantData = () => {
    console.log(`Getting applicant data for: ${jobRole} (${id})`);
    alert(`Redirecting to applicant data for: ${jobRole}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-4 bg-gray-100 rounded-xl shadow-md border-l-4 border-blue-500 transition hover:shadow-lg">
      
      <div className="flex-grow text-gray-800 mb-3 md:mb-0">
        <p className="text-lg font-semibold text-gray-900">Job Role : {jobRole}</p>
        <p className="text-sm text-gray-600">vacancy : <span className="font-medium text-blue-700">{vacancy.toString().padStart(2, '0')}</span></p>
        <p className="text-sm text-gray-600">Start Date : {startDate}</p>
        <p className="text-sm text-gray-600">End Date : {endDate}</p>
      </div>

      <div className="flex items-center space-x-4">
        
        <button
          onClick={handleGetApplicantData}
          className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400 hover:text-white transition duration-150 shadow-sm"
        >
          Get Applicant Data
        </button>

        <button
          onClick={() => onDelete(id, jobRole)}
          className="p-2 text-gray-500 transition duration-150 rounded-full hover:text-red-600 hover:bg-gray-200"
          aria-label={`Delete job post for ${jobRole}`}
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [jobPosts, setJobPosts] = useState(initialJobPosts);
  
  const organizationName = "AI-CertiAuth";
  const companyName = "Your Organization or Company Name!";

  const handleAddNewPost = () => {
    const newId = `new${Date.now()}`;
    const newPost = {
        id: newId,
        jobRole: 'New Draft Post',
        vacancy: 1,
        startDate: 'TBD',
        endDate: 'TBD',
    };
    setJobPosts([...jobPosts, newPost]);
    console.log("Navigating to 'Add new job post' form...");
  };

  const handleDeletePost = (id, roleName) => {
    if (window.confirm(`Are you sure you want to delete the job post for ${roleName}?`)) {
      setJobPosts(jobPosts.filter(post => post.id !== id));
      console.log(`Deleted post: ${id}`);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      <header className="flex items-center justify-between px-6 py-4 bg-blue-900 text-white shadow-xl sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold tracking-wider">{organizationName}</h1>
        <nav className="flex items-center space-x-6">
          <a className="text-gray-300 hover:text-white transition hidden sm:inline"><Link to={"/about"}>About</Link></a>
          <a className="text-gray-300 hover:text-white transition hidden sm:inline"><Link to={"/feature"}>Features</Link></a>
          <a className="text-gray-300 hover:text-white transition hidden sm:inline"><Link to={"/"}>Contact</Link></a>
          
          <div className="flex items-center space-x-4 border-l border-gray-700 pl-4">
            <span className="text-sm font-medium hidden md:inline">Profile</span>
            <UserCircle className="w-6 h-6 cursor-pointer hover:text-blue-300" />
            <Bell className="w-6 h-6 cursor-pointer hover:text-blue-300" />
          </div>
        </nav>
      </header>

      <main className="container max-w-4xl px-4 py-8 mx-auto flex-grow">
        
        <h2 className="mb-6 text-2xl font-light text-gray-700">
          Hii <span className="font-semibold text-gray-900">{companyName}</span>
        </h2>

        <div 
          onClick={handleAddNewPost} 
          className="flex items-center w-full max-w-xs p-4 mb-10 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition duration-200 shadow-inner"
        >
          <Plus className="w-8 h-8 text-gray-600 mr-3 border-2 border-gray-600 rounded-md p-0.5" />
          <span className="text-lg font-medium text-gray-700">Add new job post</span>
        </div>

        <h3 className="mb-5 text-xl font-bold text-gray-800 border-b pb-2">
          Your uploaded job posts :
        </h3>

        <div className="space-y-4">
          {jobPosts.length > 0 ? (
            jobPosts.map(job => (
              <JobCard key={job.id} job={job} onDelete={handleDeletePost} />
            ))
          ) : (
            <div className="text-center p-8 text-gray-500 bg-white rounded-xl shadow-md">
                No active job posts found. Click "Add new job post" to get started!
            </div>
          )}
        </div>
      </main>

      <footer className="w-full text-white bg-blue-900 mt-12 py-3 relative">
          <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto px-6">
              <div className="py-1 text-sm text-gray-300">
                  &copy; {organizationName} all rights reserved
              </div>
              
              <div className="text-sm font-bold text-orange-400 text-shadow-md">
                  Authenticity Meets Opportunity.
              </div>
          </div>
      </footer>
    </div>
  );
};

export default App;
