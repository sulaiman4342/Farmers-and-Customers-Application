import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
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
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required        
            />
          </div>
        </div>
        <div className="form-group">
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>

        <button type="submit" onClick={handleLogin} className='button-login'>Login</button>
        
      </div>
    </div>
  );
}

export default LoginPage;
