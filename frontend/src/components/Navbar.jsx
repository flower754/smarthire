import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 p-4 shadow-md text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight">SmartHire</Link>
        
        <div className="space-x-6">
          <Link to="/" className="hover:text-blue-200 transition">Home</Link>
          
          {user ? (
            <>
              {user.role === 'recruiter' && (
                <Link to="/post-job" className="hover:text-blue-200 transition">Post a Job</Link>
              )}
              <button 
                onClick={logout} 
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition text-sm font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
              <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;