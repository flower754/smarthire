import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register'; 
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import PostJob from './pages/PostJob';
import EditJob from './pages/EditJob';
import JobDetails from './pages/JobDetails'; // Adjust the path if your file is elsewhere
import JobApplications from './pages/JobApplications';


function App() {
  return (
    <div className="App bg-gray-50 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/edit-job/:id" element={<EditJob />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/job/:id/applications" element={<JobApplications />} />
      </Routes>
    </div>
  );
}

// THIS IS THE LINE VITE IS COMPLAINING ABOUT:
export default App;
