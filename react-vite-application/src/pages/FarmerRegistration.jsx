import React, { useState } from "react";
import axios from "axios";
import { notification } from 'antd';
import './FarmerRegistration.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Swal from 'sweetalert2';

const FarmerRegistrationForm = () => {
    const user_id = parseInt(localStorage.getItem('user_id'), 10);
    const username = localStorage.getItem('userRole');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        idnumber: '',
        connumber: '',
        area: '',
        size: '',
        category: '',
        user_id: user_id,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: null,
            html: '<div class="modern-loading"><div class="spinner"></div><div>Loading...</div></div>',
            showConfirmButton: false,
            allowOutsideClick: false,
        });

        try {
            const response = await axios.post('http://64.227.152.179:8080/weighingSystem-1/supplier/save', formData);

            if (response.status === 200) {
                Swal.close();
                Swal.fire({
                    title: 'Success!',
                    text: 'Farmer Registered Successfully!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });

                setFormData({
                    firstname: '',
                    lastname: '',
                    idnumber: '',
                    connumber: '',
                    area: '',
                    size: '',
                    category: '',
                    user_id: user_id,
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Registration Failed!',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            }
        } catch (error) {
            Swal.close();
            console.error('Error:', error);
            notification.error({
                message: 'Registration',
                description: 'Registration failed due to a network error.',
            });
        }
    };

    const handleView = () => {
        navigate('/farmer-list');
    };

    return (
        <>
            <div className="page-header">
                <Header />
            </div>
            <div className="form-container">
                <div className="form-header">
                    <div className="icon-container">
                        <FontAwesomeIcon icon={faUserPlus} className="form-icon" size="3x" />
                    </div>
                    <h2>Farmer Registration</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Last Name"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="idNumber">ID Number:</label>
                        <input
                            type="text"
                            name="idnumber"
                            placeholder="ID Number"
                            value={formData.idnumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactNumber">Contact Number:</label>
                        <input
                            type="text"
                            name="connumber"
                            placeholder="Contact Number"
                            value={formData.connumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="growingArea">Growing Area:</label>
                        <input
                            type="text"
                            name="area"
                            placeholder="Growing Area"
                            value={formData.area}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fieldSize">Field Size:</label>
                        <input
                            type="text"
                            name="size"
                            placeholder="Field Size"
                            value={formData.size}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fruitCategory">Fruit Category:</label>
                        <div className="radio-group">
                            {username === "Jaffna-Tomato" ? (
                                <>
                                    <label>
                                        <input
                                            type="radio"
                                            name="category"
                                            value="Potato"
                                            checked={formData.category === "Potato"}
                                            onChange={handleChange}
                                            required
                                        />
                                        Potato
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="category"
                                            value="Onion"
                                            checked={formData.category === "Onion"}
                                            onChange={handleChange}
                                            required
                                        />
                                        Onion
                                    </label>
                                </>
                            ) : (
                                <>
                                    <label>
                                        <input
                                            type="radio"
                                            name="category"
                                            value="Guava"
                                            checked={formData.category === "Guava"}
                                            onChange={handleChange}
                                            required
                                        />
                                        Guava
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="category"
                                            value="Mango"
                                            checked={formData.category === "Mango"}
                                            onChange={handleChange}
                                            required
                                        />
                                        Mango
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="category"
                                            value="Banana"
                                            checked={formData.category === "Banana"}
                                            onChange={handleChange}
                                            required
                                        />
                                        Banana
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="category"
                                            value="Papaya"
                                            checked={formData.category === "Papaya"}
                                            onChange={handleChange}
                                            required
                                        />
                                        Papaya
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="category"
                                            value="Pomegranate"
                                            checked={formData.category === "Pomegranate"}
                                            onChange={handleChange}
                                            required
                                        />
                                        Pomegranate
                                    </label>
                                </>
                            )}
                        </div>
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

export default FarmerRegistrationForm;
