import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const CoupleRegister = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Partner Information
    partnerFirstName: '',
    partnerLastName: '',
    partnerEmail: '',
    partnerPhone: '',
    
    // Wedding Information
    weddingDate: '',
    guestCount: '',
    weddingBudget: '',
    weddingLocation: '',
    
    // Account Information
    password: '',
    confirmPassword: ''
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
    
    // Personal Information Validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    // Partner Information Validation
    if (!formData.partnerFirstName) newErrors.partnerFirstName = "Partner's first name is required";
    if (!formData.partnerLastName) newErrors.partnerLastName = "Partner's last name is required";
    
    // Wedding Information Validation
    if (!formData.weddingDate) newErrors.weddingDate = 'Wedding date is required';
    if (!formData.weddingLocation) newErrors.weddingLocation = 'Wedding location is required';
    
    // Account Validation
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    console.log('Couple Registration:', formData);
    alert('Registration successful! Please check your email to verify your account.');
  };

  return (
    <div className="auth-container">
      <div className="auth-card couple-register-card">
        <h2>Couple Registration</h2>
        <p className="subtitle">Create your wedding planning account</p>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Primary Partner Information */}
          <div className="form-section">
            <h3 className="section-title">Your Information</h3>
            
            <div className="form-row">
              <div className="form-group half">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <span className="error">{errors.firstName}</span>}
              </div>
              <div className="form-group half">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name *"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <span className="error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="form-group half">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
            </div>
          </div>

          {/* Section 2: Partner Information */}
          <div className="form-section">
            <h3 className="section-title">Partner Information</h3>
            
            <div className="form-row">
              <div className="form-group half">
                <input
                  type="text"
                  name="partnerFirstName"
                  placeholder="Partner's First Name *"
                  value={formData.partnerFirstName}
                  onChange={handleChange}
                />
                {errors.partnerFirstName && <span className="error">{errors.partnerFirstName}</span>}
              </div>
              <div className="form-group half">
                <input
                  type="text"
                  name="partnerLastName"
                  placeholder="Partner's Last Name *"
                  value={formData.partnerLastName}
                  onChange={handleChange}
                />
                {errors.partnerLastName && <span className="error">{errors.partnerLastName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <input
                  type="email"
                  name="partnerEmail"
                  placeholder="Partner's Email (optional)"
                  value={formData.partnerEmail}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group half">
                <input
                  type="tel"
                  name="partnerPhone"
                  placeholder="Partner's Phone (optional)"
                  value={formData.partnerPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Wedding Information */}
          <div className="form-section">
            <h3 className="section-title">Wedding Information</h3>
            
            <div className="form-row">
              <div className="form-group half">
                <input
                  type="date"
                  name="weddingDate"
                  placeholder="Wedding Date *"
                  value={formData.weddingDate}
                  onChange={handleChange}
                />
                {errors.weddingDate && <span className="error">{errors.weddingDate}</span>}
              </div>
              <div className="form-group half">
                <input
                  type="number"
                  name="guestCount"
                  placeholder="Expected Guest Count"
                  value={formData.guestCount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <input
                  type="text"
                  name="weddingLocation"
                  placeholder="Wedding Location / Venue *"
                  value={formData.weddingLocation}
                  onChange={handleChange}
                />
                {errors.weddingLocation && <span className="error">{errors.weddingLocation}</span>}
              </div>
              <div className="form-group half">
                <input
                  type="number"
                  name="weddingBudget"
                  placeholder="Estimated Budget (RWF)"
                  value={formData.weddingBudget}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Account Security */}
          <div className="form-section">
            <h3 className="section-title">Account Security</h3>
            
            <div className="form-row">
              <div className="form-group half">
                <input
                  type="password"
                  name="password"
                  placeholder="Password *"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>
              <div className="form-group half">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password *"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>

          <button type="submit">Create Wedding Account</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default CoupleRegister;