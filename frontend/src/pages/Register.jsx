import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'candidate' 
    });
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // This hits your backend route: router.post('/register', ...)
            await axios.post('/api/auth/register', formData);
            alert('Registration Successful! Please log in.');
            navigate('/login'); 
        } catch (err) {
            alert(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Create SmartHire Account</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                /><br/><br/>
                <input 
                    type="email" 
                    placeholder="Email" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    required 
                /><br/><br/>
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    required 
                /><br/><br/>
                <select onChange={(e) => setFormData({...formData, role: e.target.value})}>
                    <option value="candidate">Candidate</option>
                    <option value="recruiter">Recruiter</option>
                </select><br/><br/>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;