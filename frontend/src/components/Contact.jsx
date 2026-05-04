import React, { useState } from 'react';
import './Contact.css';
import { getApiBaseUrl } from '../config/api';

const API_BASE = getApiBaseUrl();

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    country: 'Rwanda'
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitError('');
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          country: formData.country,
          subject: formData.subject,
          message: formData.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Could not send message. Try again later.");
      }
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', country: 'Rwanda' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <h1>Get In Touch</h1>
        <p>We would love to hear from you. Let us know how we can help make your dream wedding a reality.</p>
      </section>

      <div className="contact-container">
        {/* Contact Info Cards */}
        <div className="contact-info-grid">
          <div className="info-card">
            <h3>Email Us</h3>
            <p><a href="mailto:luminalove.com@gmail.com">luminalove.com@gmail.com</a></p>
          </div>
          <div className="info-card">
            <h3>Call Us</h3>
            <p>+250 796 599 651</p>
            <p>Monday - Friday, 9am - 6pm</p>
          </div>
          <div className="info-card">
            <h3>WhatsApp</h3>
            <p>+250 796 599 651</p>
            <p>Available 24 hours, 7 days a week</p>
          </div>
          <div className="info-card">
            <h3>Response Time</h3>
            <p>Within 24 hours</p>
            <p>Monday - Saturday</p>
          </div>
        </div>

        {/* Contact Form & Map */}
        <div className="contact-form-section">
          <div className="contact-form">
            <h2>Send Us a Message</h2>
            {submitted && (
              <div className="success-message">
                Thank you for reaching out! We will get back to you within 24 hours.
              </div>
            )}
            {submitError && (
              <div className="success-message" style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>
                {submitError}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="input-group">
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Your Name *" 
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div className="input-group">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Your Email *" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="Phone Number" 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <select name="country" value={formData.country} onChange={handleChange}>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Kenya">Kenya (Coming Soon)</option>
                    <option value="Uganda">Uganda (Coming Soon)</option>
                    <option value="Tanzania">Tanzania (Coming Soon)</option>
                    <option value="Nigeria">Nigeria (Coming Soon)</option>
                    <option value="South Africa">South Africa (Coming Soon)</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="Subject *" 
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && <span className="error">{errors.subject}</span>}
              </div>
              <div className="input-group">
                <textarea 
                  name="message" 
                  placeholder="Your Message *" 
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                {errors.message && <span className="error">{errors.message}</span>}
              </div>
              <button type="submit" disabled={sending}>{sending ? "Sending…" : "Send Message"}</button>
            </form>
          </div>


          <div className="contact-map">
            <h2>Our Global Vision</h2>
            <div className="map-placeholder">
              <div className="map-static">
                <div className="map-address-display">
                  <p><strong>Lumina Weddings</strong></p>
                  <p>Headquarters: Kigali, Rwanda</p>
                  <hr />
                  <p>Serving couples worldwide</p>
                  <p>Currently available in Rwanda</p>
                  <p>Expanding to East Africa in 2028</p>
                  <p>Global reach coming 2029</p>
                </div>
              </div>
            </div>
            <div className="map-address">
              <p><strong>Service Coverage:</strong></p>
              <p>Rwanda - Full Service Available</p>
              <p>Kenya, Uganda, Tanzania - Coming 2028</p>
              <p>Rest of Africa - Coming 2029</p>
              <p>Global Reach - Coming 2029</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Do you serve international couples?</h3>
              <p>Currently we focus on Rwanda, with plans to expand across East Africa in 2028 and globally by 2029. International couples can still use our digital planning tools.</p>
            </div>
            <div className="faq-item">
              <h3>Can I book vendors outside Rwanda?</h3>
              <p>Our vendor network is currently Rwanda-based. We are planning to expand to Kenya, Uganda, and Tanzania in 2028.</p>
            </div>
            <div className="faq-item">
              <h3>Is the platform available worldwide?</h3>
              <p>The website is accessible worldwide, but our vendor services are currently focused on Rwanda until our global expansion in 2029.</p>
            </div>
            <div className="faq-item">
              <h3>When will you expand to other countries?</h3>
              <p>We plan to expand to Kenya, Uganda, and Tanzania in 2028, followed by global reach in 2029.</p>
            </div>
            <div className="faq-item">
              <h3>How do I become a vendor?</h3>
              <p>Click on Register then Vendor Register and complete the registration form. Our team will review your application.</p>
            </div>
            <div className="faq-item">
              <h3>Is my payment secure?</h3>
              <p>Yes. We use secure payment gateways and never store your payment information on our servers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;