import React, { useState } from 'react';
import './RegistrationPage.css';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CustomerRegistrationForm from '../components/CustomerRegistrationForm'
import FarmerRegistrationForm from '../components/FarmerRegistration'


const RegistrationPage = () => {
    // const [showForm, setShowForm] = useState(false);

    // const handleCustomerRegistraion = () =>{
    //     setShowForm(true);
    // };

    const navigate = useNavigate();

    const handleCustomerRegistration = () => {
        navigate('/customer-registration');
    };

    const handleFarmerRegistration = () => {
        navigate('/farmer-registration');
    };    
    
    return (
        <>
            <Header />
            <div className='registration-container'>
                <div className='button-container'>
                    <button className="reg-button" onClick={handleCustomerRegistration}>
                        Customer Registration
                    </button>
                    <button className="reg-button" onClick={handleFarmerRegistration}>
                        Farmer Registration
                    </button>
                    <button className="reg-button">Daily Prices</button>
                </div>                
            </div>
        </>
    );
};

export default RegistrationPage;