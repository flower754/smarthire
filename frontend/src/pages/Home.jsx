import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import JobCard from '../components/JobCard'; // Import the new component

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/api/jobs');
        if (res.data && res.data.data) {
          setJobs(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setJobs(jobs.filter(job => job._id !== jobId));
      } catch (err) {
        alert(err.response?.data?.message || "Error deleting job");
      }
    }
  };

  return (
  <div className="min-h-screen bg-gray-50"> {/* Light gray background makes cards pop */}
    {/* Modern Hero Section */}
    <div className="bg-blue-600 py-20 mb-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
          Find Your <span className="text-blue-200">Dream Job</span> Today
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Connecting Tunisia's brightest talent with the most innovative companies.
        </p>
      </div>
    </div>

    <div className="container mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} user={user} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  </div>
);
};

export default Home;