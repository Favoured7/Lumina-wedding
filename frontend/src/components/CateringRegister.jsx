import React from 'react';
import { Link } from 'react-router-dom';

function CateringRegister() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '500px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Catering Registration</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          alert('Catering registration submitted!');
        }}>
          <input type="text" placeholder="Business Name" style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }} required />
          <input type="email" placeholder="Email" style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }} required />
          <input type="tel" placeholder="Phone Number" style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }} required />
          <input type="text" placeholder="Cuisine Type" style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }} required />
          <select style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }} required>
            <option value="">Select Price Range</option>
            <option value="$">$ - Budget</option>
            <option value="$$">$$ - Moderate</option>
            <option value="$$$">$$$ - Premium</option>
            <option value="$$$$">$$$$ - Luxury</option>
          </select>
          <input type="password" placeholder="Password" style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }} required />
          <input type="password" placeholder="Confirm Password" style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }} required />
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#00c3ff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Register as Catering</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Already have an account? <Link to="/login/catering" style={{ color: '#00c3ff' }}>Login here</Link></p>
      </div>
    </div>
  );
}

export default CateringRegister;