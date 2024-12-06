import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');

  const usernameRef = useRef(null);

  useEffect(() => {
    usernameRef.current?.focus(); // Focus the username input on mount
  }, []);


  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }
    
    // Loading alert with SweetAlert2
    Swal.fire({
      title: 'Logging in...',
      html: '<div class="modern-loading"><div class="spinner"></div><div>Loading...</div></div>',
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    try {
      const response = await axios.post('http://64.227.152.179:8080/weighingSystem-1/weighing/login', {
        username,
        password,
      });

      if (response.data.status === 'Login successful') {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome, ${username}!`,
          showConfirmButton: false,
          timer: 1500,
        });

        const userRole = response.data.role;
        const userId = response.data.user_id;

        localStorage.setItem('userRole', userRole);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user_id', userId);  

        console.log(`Current user role is , ${userRole}`);

        // Navigate based on role
        const route = userRole === 'ADMIN' ? '/adminUserView' : `/dashboard/${userId}`;
        setErrorMessage('');
        navigate(route);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Incorrect username or password.',
        });
        setErrorMessage('Incorrect username or password');
      }
    } catch (error) {
      console.error('Login failed:', error); // Log the error for debugging
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Internal Server Error!',
      });
      setErrorMessage('Login failed... Internal Error!');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img src="/sanota-logo.png" alt="SANOTA Logo" className="logo"
          style={{ width: '350px', height: 'auto', marginBottom: '20px' }}
        />
        <h2>Smart Weighing System</h2>
        
        <div className="form-group">
          <div className="input-wrapper" style={{ width: '60%' }}>
            <FontAwesomeIcon icon={faUser} className="input-icon" style={{ marginRight: '10px' }} />
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              ref={usernameRef}
              required
              style={{ flex: 1, padding: '10px' }}
            />
          </div>
        </div>
        
        <div className="form-group">
          <div className="input-wrapper" style={{ width: '60%' }}>
            <FontAwesomeIcon icon={faLock} className="input-icon" style={{ marginRight: '10px' }}/>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ flex: 1, padding: '10px' }}
            />
            <span className="password-toggle-icon" 
            onClick={togglePasswordVisibility}
            style={{ marginLeft: '10px', cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>

        <button type="submit" onClick={handleLogin} className="button-login">Login</button>
      </div>
    </div>
  );
}

export default LoginPage;
