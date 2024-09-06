import React from "react";
import './styles/CustomerRegistrationForm.css';
import { useNavigate } from 'react-router-dom';


const CustomerRegistrationForm = () =>{
    const navigate = useNavigate();

    const handleRegister = ()=>{
        navigate('/customer-list')
    }


    return(
        <div className="form-container">
            <div className="form-header">           
                <img src="./registration-form-icon.png" alt="Icon"  className="form-icon"/>
                <h2>Customer Registration</h2>
            </div>
            <form>
                <div className="form-group">
                    <label htmlFor = "firstName">First Name:</label>
                    <input type="text" id="firstName" placeholder="First Name" />
                </div>
                <div className="form-group">
                    <label htmlFor="LastName">Last Name:</label>
                    <input type="text" id="lastname" placeholder="Last Name" />
                </div>
                <div className="form-group">
                    <label htmlFor="idNumber">ID Number:</label>
                    <input type="text" id="idNumber" placeholder="ID Number" />
                </div>
                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number:</label>
                    <input type="text" id="contactNumber" placeholder="Contact Number" />
                </div>
                <div className="form-buttons">
                    <button type="submit" className="reg-button" onClick={handleRegister}>Register</button>
                    <button type="button" className="reg-button">View</button>
                </div>
            </form>
        </div>
    );
};

export default CustomerRegistrationForm;