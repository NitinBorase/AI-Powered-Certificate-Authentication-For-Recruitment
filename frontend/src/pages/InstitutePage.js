import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, Bell, Upload, FileText, CheckCircle, Clock, XCircle, AlertTriangle, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InstitutionApp = () => {
  const [certificates, setCertificates] = useState([]);
  const [certUploading, setCertUploading] = useState(false);
  const navigate = useNavigate();
  
  const certFileInputRef = useRef(null);
  
  // Assuming you store institution email in localStorage upon login
  const institutionEmail = localStorage.getItem('userEmail') || 'institution@example.com';
  const organizationName = "AI-CertiAuth";
  const [institutionData, setInstitutionData] = useState({
    name: 'Loading...',
    email: localStorage.getItem('userEmail') || '' 
  });

  // Fetch institution's certificates on load
  useEffect(() => {
    const fetchInstitutionData = async () => {
      if (!institutionEmail) return;

      try {
        const response = await axios.get(`https://ai-powered-certificate-authentication.onrender.com/api/institution/profile?email=${institutionEmail}`);
        
        if (response.data.success) {
          // 🌟 THIS IS THE LINE THAT POPULATES YOUR TABLE:
          setCertificates(response.data.institution.certificates || []);
          
          setInstitutionData(prev => ({
            ...prev,
            name: response.data.institution.institutionName || 'Unknown Institution'
          }));
        }
      } catch (error) {
        console.error("Error fetching institution profile:", error);
      }
    };

    fetchInstitutionData();
  }, [institutionEmail]);

  // Handle opening the file selector
  const handleCertificateUploadClick = () => {
    certFileInputRef.current && certFileInputRef.current.click();
  };

  // Handle the actual file upload
  const handleCertificateFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 1. Validate File Type
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      event.target.value = null;
      return;
    }

    setCertUploading(true);
    
    try {
      // ---------------------------------------------------------
      // STEP 1: Send File to Backend -> Cloudinary
      // ---------------------------------------------------------
      const formData = new FormData();
      formData.append('certificate', file);

      // Make sure this URL matches your backend port (5000)
      const uploadRes = await axios.post('https://ai-powered-certificate-authentication.onrender.com/api/files/uploadCertificate', formData);
      
      if (!uploadRes.data || !uploadRes.data.success) {
          throw new Error(uploadRes.data?.message || 'Cloudinary upload failed');
      }

      // We successfully got the live Cloudinary URL back!
      const certificateUrl = uploadRes.data.fileUrl;
      console.log("Cloudinary URL received:", certificateUrl);

      const dbRes = await axios.post('https://ai-powered-certificate-authentication.onrender.com/api/institution/update-certificates', {
        email: institutionEmail, // Using the email from your component's state
        certificateUrl: certificateUrl,
        fileName: file.name
      });

      if (dbRes.data && dbRes.data.success) {
        const newCert = dbRes.data.certificate; 
        
        // Add the new certificate to the top of the table
        setCertificates((prev) => [newCert, ...prev]);
        alert('Certificate successfully uploaded and saved!');
      } else {
        throw new Error(dbRes.data?.message || 'Database update failed');
      }

    } catch (err) {
      console.error('Error during upload process:', err);
      alert('Failed to upload certificate. Please check the console for details.');
    } finally {
      // Turn off loading state and reset the hidden file input
      setCertUploading(false);
      event.target.value = null;
    }
  };

  const handleLogout = () => {
    // 1. Delete all user authentication data from local storage
    localStorage.removeItem('userEmail'); 
    // Pro-tip: If you want to wipe absolutely EVERYTHING saved locally, use: localStorage.clear();

    // 2. Instantly redirect the user straight back to the home / login page
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 bg-blue-900 text-white shadow-xl sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold tracking-wider">{organizationName} - Institution Portal</h1>
        <nav className="flex items-center space-x-6">
          <Link to="/dashboard" className="text-gray-300 hover:text-white transition hidden sm:inline">Dashboard</Link>
          <div className="flex items-center space-x-4 border-l border-gray-700 pl-4">
            <span className="text-sm font-medium hidden md:inline">{institutionEmail}</span>
            <UserCircle className="w-6 h-6 cursor-pointer hover:text-blue-300" />
            <Bell className="w-6 h-6 cursor-pointer hover:text-blue-300" />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition duration-150 ease-in-out shadow-md ml-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xs:inline">Logout</span>
            </button>
          </div>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
        
        {/* Upload Section Header */}
        <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              Issue Certificates
            </h3>
            <p className="text-gray-500 text-sm mt-1">Upload PDF certificates to be hashed and issued to students.</p>
          </div>
          
          <button 
            onClick={handleCertificateUploadClick}
            disabled={certUploading}
            className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition ${certUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Upload className="w-5 h-5 mr-2" />
            {certUploading ? 'Uploading...' : 'Upload PDF'}
          </button>
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={certFileInputRef} 
            onChange={handleCertificateFileChange} 
            className="hidden" 
            accept="application/pdf"
          />
        </div>

        {/* Certificates Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b border-gray-200">
                  <th className="px-6 py-4 font-semibold text-sm">PDF Name</th>
                  <th className="px-6 py-4 font-semibold text-sm">Uploaded Date</th>
                  <th className="px-6 py-4 font-semibold text-sm">Hash ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {certificates.length > 0 ? (
                  certificates.map((cert, index) => (
                    <tr key={cert._id || index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 flex items-center text-gray-800 font-medium">
                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                          {cert.fileUrl ? (
                            <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                              {cert.fileName}
                            </a>
                          ) : (
                            cert.fileName
                          )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(cert.uploadDate).toLocaleDateString()} 
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${cert.hashId && cert.hashId !== 'None' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {cert.hashId || 'None'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                      No certificates uploaded yet. Click the upload button to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full text-white bg-blue-900 mt-auto py-3">
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

export default InstitutionApp;