import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JobApplications = () => {
  const { id } = useParams(); // This is the Job ID
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch the applications when the page loads
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const currentToken = localStorage.getItem('token');
        const res = await axios.get(`/api/applications/job/${id}`, {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
        setApplications(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setLoading(false);
      }
    };
    fetchApplications();
  }, [id]);

  // 2. Handle Accept/Reject status updates
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const currentToken = localStorage.getItem('token');
      await axios.put(`/api/applications/${applicationId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );
      
      // Update the UI instantly without refreshing the page
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-600">Loading applications...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 pt-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition font-medium"
        >
          ← Back to Job Details
        </button>
      </div>

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Candidate Applications</h1>
        
        {applications.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 text-lg">No candidates have applied for this job yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                {/* Candidate Info */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{app.candidate?.name || 'Unknown Candidate'}</h2>
                  <p className="text-gray-500">{app.candidate?.email || 'No email provided'}</p>
                  <p className="text-sm text-gray-400 mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>

                {/* Status Badge & Resume Link */}
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                  {/* Status Badge */}
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                    app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>

                  {/* View Resume Button */}
                  {/* NOTE: We point this to your backend server URL + the uploads folder */}
                  <a 
                    href={`http://localhost:5000/uploads/${app.resume}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:text-blue-800 underline px-4"
                  >
                    📄 View Resume
                  </a>

                  {/* Action Buttons */}
                  {app.status === 'pending' && (
                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => handleStatusChange(app._id, 'accepted')}
                        className="flex-1 md:flex-none bg-green-50 text-green-600 px-4 py-2 rounded-xl font-bold hover:bg-green-600 hover:text-white transition"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleStatusChange(app._id, 'rejected')}
                        className="flex-1 md:flex-none bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;