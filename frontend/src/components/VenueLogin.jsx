import React from 'react';
import { Link } from 'react-router-dom';

function VenueLogin() {
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
        maxWidth: '450px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Venue Login</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          alert('Venue login submitted!');
        }}>
          <input 
            type="email" 
            placeholder="Email" 
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px'
            }}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px'
            }}
            required 
          />
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#00c3ff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Login as Venue
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Don't have an account? <Link to="/register/venue" style={{ color: '#00c3ff' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default VenueLogin;
 