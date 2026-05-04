import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const VendorRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    vendorType: '',
    phone: '',
    city: '',
    description: '',
    priceRange: '',
    website: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.vendorType) newErrors.vendorType = 'Please select vendor type';
    if (!formData.businessName) newErrors.businessName = 'Business name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.priceRange) newErrors.priceRange = 'Price range is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('Vendor Registration:', formData);
    alert('Registration submitted successfully! Please wait for approval.');
  };

  const vendorTypes = [
    { value: 'photographer', label: 'Photographer', desc: 'Wedding & event photography services' },
    { value: 'makeup_artist', label: 'Makeup Artist', desc: 'Bridal & event makeup services' },
    { value: 'venue', label: 'Venue', desc: 'Wedding ceremony & reception venues' },
    { value: 'catering', label: 'Catering', desc: 'Food & beverage services' },
    { value: 'planner', label: 'Wedding Planner', desc: 'Full wedding planning services' },
    { value: 'florist', label: 'Florist', desc: 'Flower arrangements & decor' },
    { value: 'musician', label: 'Musician / DJ', desc: 'Live music or DJ entertainment services' }
  ];

  const priceRanges = [
    { value: '$', label: '$ - Budget Friendly' },
    { value: '$$', label: '$$ - Moderate' },
    { value: '$$$', label: '$$$ - Premium' },
    { value: '$$$$', label: '$$$$ - Luxury' }
  ];

  const cities = ['Kigali', 'Musanze', 'Rubavu', 'Huye', 'Muhanga', 'Rwamagana', 'Nyagatare', 'Other'];

  return (
    <div className="auth-container">
      <div className="auth-card vendor-register-card">
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Select Category</div>
          </div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Business Details</div>
          </div>
        </div>

        <h2>Vendor Registration</h2>
        <p className="subtitle">Join our trusted vendor network</p>

        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          {step === 1 && (
            <div className="form-step">
              <div className="vendor-type-grid">
                {vendorTypes.map((type) => (
                  <label key={type.value} className={`vendor-type-card ${formData.vendorType === type.value ? 'selected' : ''}`}>
                    <input type="radio" name="vendorType" value={type.value} checked={formData.vendorType === type.value} onChange={handleChange} style={{ display: 'none' }} />
                    <div className="vendor-type-content">
                      <div className="vendor-type-name">{type.label}</div>
                      <div className="vendor-type-desc">{type.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.vendorType && <span className="error">{errors.vendorType}</span>}

              <input type="text" name="businessName" placeholder="Business Name *" value={formData.businessName} onChange={handleChange} />
              {errors.businessName && <span className="error">{errors.businessName}</span>}

              <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} />
              {errors.email && <span className="error">{errors.email}</span>}

              <div className="form-row">
                <div className="form-group half">
                  <input type="password" name="password" placeholder="Password *" value={formData.password} onChange={handleChange} />
                </div>
                <div className="form-group half">
                  <input type="password" name="confirmPassword" placeholder="Confirm Password *" value={formData.confirmPassword} onChange={handleChange} />
                </div>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <input type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleChange} />
              {errors.phone && <span className="error">{errors.phone}</span>}

              <textarea name="description" placeholder="Describe your business (services, experience, what makes you special)" value={formData.description} onChange={handleChange} rows="4" />

              <div className="form-row">
                <div className="form-group half">
                  <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="form-group half">
                  <select name="city" value={formData.city} onChange={handleChange}>
                    <option value="">Select City *</option>
                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                  {errors.city && <span className="error">{errors.city}</span>}
                </div>
              </div>

              <input type="url" name="website" placeholder="Website (optional)" value={formData.website} onChange={handleChange} />

              <select name="priceRange" value={formData.priceRange} onChange={handleChange}>
                <option value="">Select Price Range *</option>
                {priceRanges.map(range => <option key={range.value} value={range.value}>{range.label}</option>)}
              </select>
              {errors.priceRange && <span className="error">{errors.priceRange}</span>}
            </div>
          )}

          <div className="form-buttons">
            {step === 2 && (
              <button type="button" onClick={handleBack} className="btn-secondary">Back</button>
            )}
            <button type="submit" className="btn-primary">{step === 1 ? 'Continue' : 'Register'}</button>
          </div>
        </form>

        <p>Already have a vendor account? <Link to="/login/vendor">Login here</Link></p>
      </div>
    </div>
  );
};

export default VendorRegister;