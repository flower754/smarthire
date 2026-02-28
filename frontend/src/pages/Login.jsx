import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import our "Brain"
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext); // Get the login function from context
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Send credentials to backend
            const res = await axios.post('/api/auth/login', formData);
            
            // 2. Use the AuthContext to save the token
            login(res.data.token); 
            
            alert('Login Successful!');
            navigate('/'); // Go to the home page
        } catch (err) {
            alert(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Login to SmartHire</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;