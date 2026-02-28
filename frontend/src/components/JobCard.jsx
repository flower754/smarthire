import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, user, onDelete }) => {
  // Check if the currently logged-in user is the recruiter who posted this job
  const isOwner = user?.role === 'recruiter' && (user?._id === job.recruiter || user?.id === job.recruiter);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h2>
        <p className="text-blue-600 font-semibold mb-4">{job.company}</p>
        
        <div className="flex items-center text-gray-500 mb-4 text-sm">
          <span>📍 {job.location || 'Tunis'}</span>
          <span className="ml-4">💰 {job.salary || 'Negotiable'}</span>
        </div>
        
        <p className="text-gray-600 line-clamp-2 mb-4 italic">{job.description}</p>

        {/* Requirements Preview Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {job.requirements && job.requirements.slice(0, 3).map((req, index) => (
            <span key={index} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md border border-blue-100 font-medium">
              {req}
            </span>
          ))}
          {job.requirements?.length > 3 && (
            <span className="text-gray-400 text-xs pt-1">+{job.requirements.length - 3} more</span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Everyone sees the View Details button */}
        <Link 
          to={`/job/${job._id}`}
          className="w-full block bg-gray-900 text-white py-2 rounded-xl font-semibold text-center hover:bg-gray-800 transition"
        >
          View Details
        </Link>

        {/* ONLY the Recruiter who owns this job sees these buttons */}
        {isOwner && (
          <div className="flex flex-col gap-2 mt-2">
            
            {/* NEW: View Applications Button (Purple) */}
            <Link 
              to={`/job/${job._id}/applications`}
              className="bg-purple-50 text-purple-700 py-2 rounded-xl font-semibold text-center border border-purple-100 hover:bg-purple-100 transition"
            >
              📋 View Applications
            </Link>
            
            <div className="grid grid-cols-2 gap-2">
              <Link 
                to={`/edit-job/${job._id}`}
                className="bg-blue-50 text-blue-600 py-2 rounded-xl font-semibold text-center hover:bg-blue-100 transition"
              >
                Edit
              </Link>
              <button 
                onClick={() => onDelete(job._id)}
                className="bg-red-50 text-red-600 py-2 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition duration-200"
              >
                Delete
              </button>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;