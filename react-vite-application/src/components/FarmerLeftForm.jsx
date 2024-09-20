import React from "react";
import PropTypes from "prop-types";
import './styles/FarmerLeftForm.css';

const FarmerLeftForm = ({ farmerData }) => {
  return (
    <div className="left-form-container">
      <div className="avatar-placeholder">
        <img src="person icon.png" alt="person-icon" />
      </div>
      <div className="left-form">
        <div className="form-group">
          <label>Full Name:</label>
          <input type="text" value={farmerData.fullName} readOnly />
        </div>
        <div className="form-group">
          <label>NIC Number:</label>
          <input type="text" value={farmerData.nicNumber} readOnly />
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input type="text" value={farmerData.contactNumber} readOnly />
        </div>
        <div className="form-group">
          <label>Size:</label>
          <input type="text" value={farmerData.size} readOnly />
        </div>
        <div className="form-group">
          <label>Growing Area:</label>
          <input type="text" value={farmerData.growingArea} readOnly />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input type="text" value={farmerData.category} readOnly />
        </div>
      </div>
    </div>
  );
};

FarmerLeftForm.propTypes = {
  farmerData: PropTypes.shape({
    fullName: PropTypes.string,
    nicNumber: PropTypes.string,
    contactNumber: PropTypes.string,
    size: PropTypes.string,
    growingArea: PropTypes.string,
    category: PropTypes.string,
  }).isRequired,
};

export default FarmerLeftForm;
