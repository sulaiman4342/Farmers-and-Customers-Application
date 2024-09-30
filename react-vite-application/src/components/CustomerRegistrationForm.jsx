import React from "react";
import './styles/CustomerRegistrationForm.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Header from "./Header";

const CustomerRegistrationForm = () => {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/customer-list');
    };

    return (
        <div className="registration-form-container">
            <div className="form-header">
                <FontAwesomeIcon icon={faUserPlus} className="form-icon"  size="3x"/>
                <h2>Customer Registration</h2>
            </div>
            <form>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input type="text" id="firstName" placeholder="First Name" />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input type="text" id="lastName" placeholder="Last Name" />
                </div>
                <div className="form-group">
                    <label htmlFor="idNumber">ID Number:</label>
                    <input type="text" id="idNumber" placeholder="ID Number" />
                </div>
                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number:</label>
                    <input type="text" id="contactNumber" placeholder="Contact Number" />
                </div>
                <div className="form-buttons-reg-page">
                    <button type="submit" className="reg-view-button" onClick={handleRegister}>Register</button>
                    <button type="button" className="reg-view-button">View</button>
                </div>
            </form>
        </div>
    );
};

export default CustomerRegistrationForm;
