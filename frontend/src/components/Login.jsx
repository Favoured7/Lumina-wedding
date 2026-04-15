import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom"; 
import "./Login.css";

function Login() {
  const[email, setEmail]= useState('');
  const[password, setPassword]= useState('');
  const[error, setError]= useState('');
  const[loading, setLoading]= useState(false);
  const[navigate]= useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try{
      console.log('login attempt with:', {email,password});
      setTimeout(()=>{
        setLoading(false);
        navigate('/dashboard');
      },100);
    }
    catch(err){
      setError('login failed.please check your credentials');
      setLoading(false);

    }
  };
  return(
    <div className="login-container">
    <div className="login-card">
    <div className="login-header">
    <h1>Lumina</h1>
    <p>welcome back to your wedding journey</p>
    </div>
    {error && <div className="error message">{error}</div>}
    <form onSubmit={handleSubmit} className="login-form">
    <div className="form-group">
    <label htmlFor="email">Email address(Login ID)</label>
    <input
    type="email"
    id="email"
    value={email}
    onChange={(e) =>setEmail(e.target.value)}
    required
    placeholder="Enter your email"
    disabled={loading}
    />
    </div>
    <div className="form-group">
    <label htmlFor="password">password</label>
    <input type="password" id="password" value={password} 
    onChange={(e) => setPassword(e.target.value)}
    required
    placeholder="Enter your password"
    disabled={loading}
    />
    </div>
    <button type="submit" className="login-btn" disabled={loading}>
      {loading ? 'logging in...': 'login'}
    </button>
    </form>
    <div className="login-footer">
      <p>
        don't have an account?{''}
        <link to="/register" className="register-link"> register here
        </link>
        </p>
        </div>
        </div>
        </div>
  );
  
}

export default Login;