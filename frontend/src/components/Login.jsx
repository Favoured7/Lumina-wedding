import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { getApiBaseUrl } from '../config/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Login successful:', data.user);
        
        // Check for intended booking (from vendor detail page)
        const intendedBooking = localStorage.getItem('intendedBooking');
        if (intendedBooking) {
          localStorage.removeItem('intendedBooking');
          const booking = JSON.parse(intendedBooking);
          navigate(`/services/${booking.vendorType}/${booking.vendorId}`);
        } 
        // Redirect based on user role
        else if (data.user.role === 'couple') {
          navigate('/dashboard/couple');
        } else if (data.user.role === 'admin') {
          navigate('/dashboard/admin');
        } else if (data.user.role === 'vendor') {
          navigate('/dashboard/vendor');
        } else {
          navigate('/');
        }
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Couple Login</h2>
        <p className="subtitle">Welcome back. Login to your wedding planning account</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <div className="error-message">{error}</div>}

          <div className="form-links">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login as Couple'}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/register/couple">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;