import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faUserPen, } from '@fortawesome/free-solid-svg-icons/faUserPen';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password==='admin123') {
      navigate('/registration');// Navigate to dashboard on successful login
      setErrorMessage(''); // Clear error message
    } else {
      setErrorMessage('Incorrect username or password'); //Set error message
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img src="/sanota-logo.png" alt="SANOTA Logo" className="logo" />
        <h2>Smart Weighing System</h2>
          <div className="form-group">
            <input
              type="text"
              id="username"
              name="username"
              placeholder=" Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className='input-for-username'
        
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder=" Password" // Font Awesome lock icon as placeholder
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='input-for-password'
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          <button type="submit" onClick={handleLogin}>Login</button>
      
            
        
      </div>
    </div>
  );
}

export default LoginPage;
