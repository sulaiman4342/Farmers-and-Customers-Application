// File: src/components/CustomerSearchBar.jsx
import React from 'react';
import './styles/CustomerSearchBar.css'; 

const CustomerSearchBar = ({ customerId, setCustomerId, handleCustomerSearch }) => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Scan Your QR code or Enter Customer ID..."
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="customer-page-search-bar"
      />
      <button onClick={handleCustomerSearch} className="sel45ect-button">Select</button>
    </div>
  );
};

export default CustomerSearchBar;
