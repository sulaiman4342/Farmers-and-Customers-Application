// File: src/components/CustomerLeftForm.jsx
import React from 'react';
import './styles/CustomerLeftForm.css'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const CustomerLeftForm = ({ customerData }) => {
  return (
    <div className="left-form-container">
      <FontAwesomeIcon icon={faUser} size="3x" className="fa-user"/> 
      
      <div className="left-form">
        <div className="form-group">
          <label>Full Name:</label>
          <input type="text" value={customerData.fullName} readOnly />
        </div>
        <div className="form-group">
          <label>NIC Number:</label>
          <input type="text" value={customerData.nicNumber} readOnly />
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input type="text" value={customerData.contactNumber} readOnly />
        </div>
      </div>
    </div>
  );
};

export default CustomerLeftForm;
