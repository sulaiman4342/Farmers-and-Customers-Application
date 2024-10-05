import React, { useState } from 'react';
import './RegistrationPage.css';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';


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
                    <button className="regis-button" onClick={handleCustomerRegistration}>
                        Customer Registration
                    </button>
                    <button className="regis-button" onClick={handleFarmerRegistration}>
                        Farmer Registration
                    </button>
                    <button className="regis-button">Daily Prices</button>
                </div>           
            </div>
            
        </>
    );
};

export default RegistrationPage;