import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    requirements: '' // Added to state
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get('/api/jobs');
        const job = res.data.data.find(j => j._id === id);
        if (job) {
          setFormData({
            title: job.title,
            company: job.company,
            location: job.location || '',
            description: job.description,
            salary: job.salary || '',
            // Convert array back to string for editing
            requirements: job.requirements ? job.requirements.join(', ') : '' 
          });
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Convert string back to array before sending
      const updatedData = {
        ...formData,
        requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req !== "")
      };

      await axios.put(`/api/jobs/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Job updated successfully!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating job');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Edit Job Posting</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>

        {/* NEW REQUIREMENTS INPUT FOR EDITING */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (separate with commas)</label>
          <input 
            type="text" 
            name="requirements" 
            value={formData.requirements} 
            onChange={handleChange} 
            placeholder="e.g. React, Node, French"
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl h-40 outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
          <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => navigate('/')} className="w-1/3 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition">
            Cancel
          </button>
          <button type="submit" className="w-2/3 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;