import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
    role: 'support'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    // Optional: Uncomment for production
    // if (!formData.adminCode) newErrors.adminCode = 'Admin registration code is required';
    // if (formData.adminCode !== 'ADMIN2026') newErrors.adminCode = 'Invalid admin code';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    console.log('Admin Registration:', formData);
    alert('Admin registration submitted successfully!');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Admin Registration</h2>
        <p className="subtitle">Register as system administrator</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group half">
              <input type="text" name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleChange} />
              {errors.firstName && <span className="error">{errors.firstName}</span>}
            </div>
            <div className="form-group half">
              <input type="text" name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleChange} />
              {errors.lastName && <span className="error">{errors.lastName}</span>}
            </div>
          </div>

          <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}

          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />

          <input type="password" name="password" placeholder="Password *" value={formData.password} onChange={handleChange} />
          {errors.password && <span className="error">{errors.password}</span>}

          <input type="password" name="confirmPassword" placeholder="Confirm Password *" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="support">Support Administrator</option>
            <option value="content_manager">Content Manager</option>
            <option value="super_admin">Super Administrator</option>
          </select>

          {/* Optional admin code field - can be removed for development */}
          {/* 
          <input type="password" name="adminCode" placeholder="Admin Registration Code" value={formData.adminCode} onChange={handleChange} />
          {errors.adminCode && <span className="error">{errors.adminCode}</span>}
          <small className="hint">Contact system administrator for the registration code</small>
          */}

          <button type="submit">Register as Admin</button>
        </form>

        <p>Already have an admin account? <Link to="/login/admin">Login here</Link></p>
      </div>
    </div>
  );
};

export default AdminRegister;