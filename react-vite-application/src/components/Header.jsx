import React, { useState } from 'react';
import './styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <button className="nav-toggle" onClick={toggleNav}>
          <FontAwesomeIcon icon={isNavVisible ? faTimes : faBars} />
        </button>
        <ul className={`nav-list ${isNavVisible ? 'nav-visible' : ''}`}>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/registration">Registration</a></li>
          <li><a href="#">Farmers</a></li>
          <li><a href="#">Customers</a></li>
          <li><a href="#">About us</a></li>
          <li><a href="#">Logout</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
