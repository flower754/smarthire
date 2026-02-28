import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    requirements: '' // Kept as a string for the input field
  });

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Grab the token straight from the browser's vault, ignoring React Context
      const secureToken = localStorage.getItem('token'); 

      const jobData = {
        ...formData,
        requirements: formData.requirements 
          ? formData.requirements.split(',').map(req => req.trim()).filter(req => req !== "") 
          : []
      };

      await axios.post('/api/jobs', jobData, {
        // 2. Use the secureToken here
        headers: { Authorization: `Bearer ${secureToken}` } 
      });
      
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Post a New Job</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            name="title" 
            value={formData.title} 
            placeholder="Job Title" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
            required 
          />
        </div>
        
        <div>
          <input 
            name="company" 
            value={formData.company} 
            placeholder="Company Name" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
            Requirements (e.g. React, Node, French)
          </label>
          <input 
            name="requirements" 
            value={formData.requirements} 
            placeholder="Separate skills with commas" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input 
            name="location" 
            value={formData.location} 
            placeholder="Location" 
            onChange={handleChange} 
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <input 
            name="salary" 
            value={formData.salary} 
            placeholder="Salary" 
            onChange={handleChange} 
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        
        <div>
          <textarea 
            name="description" 
            value={formData.description} 
            placeholder="Job Description" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-xl h-32 outline-none focus:ring-2 focus:ring-blue-500" 
            required 
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-md"
        >
          Post Job Listing
        </button>
      </form>
    </div>
  );
};

export default PostJob;