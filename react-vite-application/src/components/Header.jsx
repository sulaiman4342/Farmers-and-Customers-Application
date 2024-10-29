// Header.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './styles/Header.css';

const Header = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  // Close the navbar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsNavVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <nav className="navbar" ref={navRef}>
        <button className="nav-toggle" onClick={toggleNav}>
          <FontAwesomeIcon icon={isNavVisible ? faTimes : faBars} />
        </button>
        <ul className={`nav-list ${isNavVisible ? 'nav-visible' : ''}`}>
          <li className={location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className={location.pathname === '/registration' ? 'active' : ''}>
            <Link to="/registration">Registration</Link>
          </li>
          <li className={location.pathname === '/farmerPage' ? 'active' : ''}>
            <Link to="/farmerPage">Farmers</Link>
          </li>
          <li className={location.pathname === '/customerPage' ? 'active' : ''}>
            <Link to="/customerPage">Customers</Link>
          </li>
          <li className={location.pathname === '/about' ? 'active' : ''}>
            <Link to="/about">About us</Link>
          </li>
          <li>
            <Link to="/" onClick={() => { 
              localStorage.clear(); 
              navigate('/'); 
            }}>Logout</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
