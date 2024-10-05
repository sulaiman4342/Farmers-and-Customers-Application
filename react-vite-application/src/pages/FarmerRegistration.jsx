import React from "react";
import './FarmerRegistration.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";

const FarmerRegistrationForm = () =>{

    const navigate = useNavigate();

    const handleRegister = ()=>{
        navigate('/farmer-list')
    }
 

    return(
        <>
            <div className="page-header">
                <Header />
            </div>
            <div className="form-container">
                <div className="form-header">
                    <div className="icon-container">
                        <FontAwesomeIcon icon={faUserPlus} className="form-icon"  size="3x"/>
                    </div>
                    <h2>Farmer Registration</h2>
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
                    <div className="form-group">
                        <label htmlFor="growingArea">Growing Area:</label>
                        <input type="text" id="growingArea" placeholder="Growing Area" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fieldSize">Field Size:</label>
                        <input type="text" id="fieldSize" placeholder="Field Size" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fruitCategory">Fruit Category:</label>
                        <div className="radio-group">
                            <label htmlFor="guava"><input type="radio" name="fruitCategory" id="guava" value="Guava" /> Guava</label>
                            <label htmlFor="mango"><input type="radio" name="fruitCategory" id="mango" value="Mango" /> Mango</label>
                            <label htmlFor="banana"><input type="radio" name="fruitCategory" id="banana" value="Banana" /> Banana</label>
                            <label htmlFor="papaya"><input type="radio" name="fruitCategory" id="papaya" value="Papaya" /> Papaya</label>
                        </div>
                    </div>
                    <div className="form-buttons-reg-page">
                        <button type="submit" className="reg-view-button" onClick={handleRegister}>Register</button>
                        <button type="button" className="reg-view-button">View</button>
                    </div>
                </form>
            </div>
        </>
        
    );
};

export default FarmerRegistrationForm;