import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, Bell, Upload, FileText, CheckCircle, Clock, XCircle, AlertTriangle, FileInput } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const initialCertificates = [
  {
    id: 'c001',
    fileName: 'Java Certificate',
    status: 'Verified',
    uploadedDate: '19/09/2025',
    actionRequired: 'No Action Required',
  },
  {
    id: 'c002',
    fileName: 'Power BI Certificate',
    status: 'Pending',
    uploadedDate: '02/10/2025',
    actionRequired: 'No Action Required',
  },
  {
    id: 'c003',
    fileName: 'NPTEL',
    status: 'Verified',
    uploadedDate: '15/09/2025',
    actionRequired: 'No Action Required',
  },
  {
    id: 'c004',
    fileName: 'Event Participation',
    status: 'Not Verified',
    uploadedDate: '20/08/2025',
    actionRequired: 'Please Verify Certificate',
  },
];
//Comment
const getStatusInfo = (status) => {
  switch (status) {
    case 'Verified':
      return { text: 'text-green-600', icon: CheckCircle, bgColor: 'bg-green-100', borderColor: 'border-green-500' };
    case 'Pending':
      return { text: 'text-yellow-600', icon: Clock, bgColor: 'bg-yellow-100', borderColor: 'border-yellow-500' };
    case 'Not Verified':
      return { text: 'text-red-600', icon: XCircle, bgColor: 'bg-red-100', borderColor: 'border-red-500' };
    default:
      return { text: 'text-gray-500', icon: AlertTriangle, bgColor: 'bg-gray-100', borderColor: 'border-gray-400' };
  }
};

const App = () => {
  const [certificates, setCertificates] = useState(initialCertificates);
  const [currentResume, setCurrentResume] = useState('Loading...');
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const userEmail = localStorage.getItem('userEmail') || 'User Name!';
  const userName = `${userEmail}`;
  const organizationName = "AI-CertiAuth";

  useEffect(() => {
        const fetchUserData = async () => {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/files/profile?email=${userEmail}`);
                if (response.data.success && response.data.user.resumeUrl) {
                    console.log("Fetched profile data:", response.data);
                    setResumeUrl(response.data.user.resumeUrl);
                    setCurrentResume(response.data.user.fileName); 
                } else {
                    setCurrentResume("No resume uploaded");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setCurrentResume("Error loading profile");
            }
        };

        fetchUserData();
    }, []);

  const fileInputRef = useRef(null);

  const uploadToCloud = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);

    try{
      const response = await axios.post('http://localhost:5000/api/files/uploadResume', formData);

      const resumeUrl = response.data.fileUrl;
      const userEmail = localStorage.getItem('userEmail');

      const dbResponse = await axios.post('http://localhost:5000/api/files/update-db', {
        email: userEmail,
        resumeUrl: resumeUrl,
        fileName: file.name
      });

      if (dbResponse.data.success) {
          setCurrentResume(file.name);
          // alert("Resume uploaded and saved to profile!");
          console.log("Database updated with resume URL:", resumeUrl, dbResponse.data.user);
      }

      if(response.data.success){
        setCurrentResume(file.name);
        alert('Resume uploaded successfully!');
        console.log('Resume uploaded successfully:', response.data.fileUrl);
      }
    }
    catch(err){
      console.error('Error uploading resume:', err);
      alert('Failed to upload resume. Please try again.');
    }
    finally{
      setUploading(false);
    }
  };

  const handleFileChange = async(event) => {
    const file = event.target.files[0];
    if(!file) return;

    if(file.type !== 'application/pdf'){
      alert('Please upload a PDF file.');
      return;
    }
    console.log('Uploading file:', file.name);

    await uploadToCloud(file);

    event.target.value = null;
  }

  const handleResumeUpload = () => {
    fileInputRef.current.click();
  };

  const handleCertificateUpload = () => {
    console.log("Opening file picker for certificate upload...");
    alert("Certificate upload simulated. In a real app, this opens the file dialog.");
  };

  const handleVerifyAction = (certId, fileName) => {
    console.log(`User requested verification for: ${fileName}`);
    alert(`Verification request sent for ${fileName}. We'll notify you soon.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      <header className="flex items-center justify-between px-6 py-4 bg-blue-900 text-white shadow-xl sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold tracking-wider">{organizationName}</h1>
        <nav className="flex items-center space-x-6">
          {/* <a className="text-gray-300 hover:text-white transition hidden sm:inline"><Link to={"/about"}>About</Link></a>
          <a className="text-gray-300 hover:text-white transition hidden sm:inline"><Link to={"/feature"}>Features</Link></a>
          <a className="text-gray-300 hover:text-white transition hidden sm:inline"><Link to={"/"}>Contact</Link></a> */}
          
          <div className="flex items-center space-x-4 border-l border-gray-700 pl-4">
            <span className="text-sm font-medium hidden md:inline">Profile</span>
            <UserCircle className="w-6 h-6 cursor-pointer hover:text-blue-300" />
            <Bell className="w-6 h-6 cursor-pointer hover:text-blue-300" />
          </div>
        </nav>
      </header>

      <main className="container max-w-5xl px-4 py-8 mx-auto flex-grow">
        
        <h2 className="mb-8 text-2xl font-light text-gray-700">
          Hii <span className="font-semibold text-gray-900">{userName}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <input 
            type = 'file'
            ref = {fileInputRef}
            onChange={handleFileChange}
            className='hidden'
            accept='.pdf'
          />
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-blue-600" />
                    Resume
                </h3>
                <button 
                    onClick={handleResumeUpload}
                    className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition"
                    aria-label="Upload Resume"
                >
                    <Upload className="w-6 h-6" />
                </button>
            </div>
            <p className="text-sm font-medium text-gray-600">Current Resume:</p>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
            <p className="text-base font-semibold text-blue-700 underline truncate">{currentResume}</p>
            </a>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                Add new certificate to your profile :
            </h3>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <input
                    type="text"
                    placeholder="Browse file..."
                    className="flex-grow p-2 text-gray-700 border-none focus:ring-0"
                    readOnly 
                />
                <button
                    onClick={handleCertificateUpload}
                    className="p-2 bg-blue-600 text-white hover:bg-blue-700 transition"
                    aria-label="Add Certificate"
                >
                    <Upload className="w-6 h-6" />
                </button>
            </div>
          </div>
        </div>

        <h3 className="mb-5 text-xl font-bold text-gray-800 border-b pb-2">
          Your Uploaded Certificates :
        </h3>

        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  File Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Uploaded Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Action Required
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((cert) => {
                const { text, icon: StatusIcon, bgColor, borderColor } = getStatusInfo(cert.status);
                const isVerifyActionNeeded = cert.actionRequired !== 'No Action Required';

                return (
                  <tr key={cert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cert.fileName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${text} ${bgColor} border ${borderColor}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cert.uploadedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {isVerifyActionNeeded ? (
                        <button 
                          onClick={() => handleVerifyAction(cert.id, cert.fileName)}
                          className="text-red-600 font-semibold underline hover:text-red-800 transition"
                        >
                          {cert.actionRequired}
                        </button>
                      ) : (
                        <span className="text-gray-500">
                          {cert.actionRequired}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
