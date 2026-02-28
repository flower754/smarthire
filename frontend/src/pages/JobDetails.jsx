import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // NEW: Application Modal States
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/jobs/${id}`);
        setJob(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job:", err);
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // NEW: Handle Application Submission
  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeFile) return alert("Please select a resume file.");

    try {
      const currentToken = localStorage.getItem('token');
      
      // When uploading files, we MUST use FormData, not a standard JSON object
      const formData = new FormData();
      formData.append('resume', resumeFile); // This matches upload.single('resume') in your backend

      await axios.post(`/api/applications/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${currentToken}`,
          'Content-Type': 'multipart/form-data' // Crucial for file uploads
        }
      });
      
      alert('Application submitted successfully!');
      setShowApplyModal(false); // Close the modal
    } catch (err) {
      alert(err.response?.data?.error || err.message || "Failed to apply");
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-600">Loading job details...</div>;
  if (!job) return <div className="text-center mt-20 text-red-500">Job not found.</div>;

  const isCandidate = user?.role === 'candidate';

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {/* Container for Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition font-medium"
        >
          ← Back to Listings
        </button>
      </div>

      {/* Header Section */}
      <div className="bg-white border-b py-8 mb-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <nav className="text-sm text-gray-500 mb-2">Jobs / {job.company} / {job.title}</nav>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-1">{job.title}</h1>
            <p className="text-blue-600 font-semibold text-xl">{job.company}</p>
          </div>
          
          {/* UPDATED: Button now opens the modal */}
          {isCandidate && (
            <button 
              onClick={() => setShowApplyModal(true)}
              className="mt-4 md:mt-0 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Job Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
              {job.description}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Requirements</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-3 text-lg">
              {job.requirements && job.requirements.length > 0 ? (
                job.requirements.map((req, index) => (
                  <li key={index} className="pl-2">{req}</li>
                ))
              ) : (
                <li className="text-gray-400 italic text-base">No specific requirements provided.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Job Overview</h3>
            <div className="space-y-5 text-base">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">📍 Location</span>
                <span className="font-bold text-gray-900">{job.location || 'Remote'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">💰 Salary</span>
                <span className="font-bold text-gray-900 font-mono">{job.salary || 'Negotiable'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">📅 Posted</span>
                <span className="font-bold text-gray-900">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Apply Modal Popup */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Apply for {job.title}</h3>
            <p className="text-gray-500 mb-6">Upload your resume to apply for this position at {job.company}.</p>
            
            <form onSubmit={handleApply}>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Resume (PDF)</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowApplyModal(false)}
                  className="w-1/2 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobDetails;