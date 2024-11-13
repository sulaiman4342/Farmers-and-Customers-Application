import React, { useState } from 'react';
import './CustomerRegistrationForm.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import axios from 'axios';
import Swal from 'sweetalert2';
import { notification } from 'antd';


const CustomerRegistrationForm = () => {

    const navigate = useNavigate();
    const user_id = parseInt(localStorage.getItem('user_id'), 10);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        idNumber: '',
        contacNumber:'',
        user_id: user_id,
    });

    const handleChange =(e) =>{
        const { name, value } = e.target;
        setFormData((prevData) => ({
             ...prevData,
             [name]: value,
            }));
    };

    const handleSubmit = async(e) =>{
        e.preventDefault();

        Swal.fire({
            title: null,
            html: '<div class="modern-loading"><div class="spinner"></div><div>Loading...</div></div>',
            showConfirmButton: false,
            allowOutsideClick: false,
          });

        try{
            const response = await axios.post('http://64.227.152.179:8080/weighingSystem-1/seller/save', formData)
            if (response.status === 200) {
                Swal.close();
                Swal.fire({
                  title: 'Success!',
                  text: 'Customer Registered Successfully!',
                  icon: 'success',
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                });

                // Reset form data
                setFormData({
                    firstName: '',
                    lastName: '',
                    idNumber: '',
                    contactNumber: '',
                    user_id: user_id,
                });
            } else {
                throw new Error('Registation Failed!');
            }
        } catch (error){
            Swal.close();
            notification.error({
                message: "Registration",
                description: 'Registration failed due to a network error.',
            });
        }
    };

    const handleView = () => {
        navigate('/customer-list');
    };

    return (
        <>
            
            <div className="page-header">
                <Header />
            </div>
            <div className="registration-form-container">          
                <div className="form-header">
                    <div className="icon-container">
                        <FontAwesomeIcon icon={faUserPlus} className="form-icon"  size="3x"/>
                    </div>
                    <h2>Customer Registration</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="idNumber">ID Number:</label>
                        <input
                        type="text"
                        id="idNumber"
                        name="idNumber"
                        placeholder="ID Number"
                        value={formData.idNumber}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactNumber">Contact Number:</label>
                        <input
                        type="text"
                        id="contactNumber"
                        name="contactNumber"
                        placeholder="Contact Number"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="form-buttons-reg-page">
                        <button type="submit" className="reg-view-button">Register</button>
                        <button type="button" className="reg-view-button" onClick={handleView}>View</button>
                    </div>
                </form>
            </div>
        </>    
    );
};

export default CustomerRegistrationForm;
