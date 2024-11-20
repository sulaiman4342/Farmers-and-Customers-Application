import React, { useState } from 'react';
import axios from 'axios';
import {notification } from 'antd';
import Header from '../components/Header';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import './DailyPrice.css'


function PriceAdd() {

  const user_id = parseInt(localStorage.getItem('user_id'), 10);

  // // Helper function to get today's date in YYYY-MM-DD format
  // const getFormattedDate = () => {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = String(today.getMonth() + 1).padStart(2, '0'); // padStart ensures 2-digit month
  //   const day = String(today.getDate()).padStart(2, '0'); // padStart ensures 2-digit day
  //   return `${year}-${month}-${day}`;
  // };

  const [formData, setFormData] = useState({
    exportsell: '',
    local_no_1sell: '',
    local_no_2sell: '',
    grade3sell:'',
    date: new Date().toISOString().slice(0, 10),
    bulkbuy: {
      guava: '',
      mango: '',
      banana: '',
      papaya: '',
      pomegranate: '',
    },
    user_id:user_id
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('bulkbuy_')) {
      const category = name.replace('bulkbuy_', '');
      setFormData((prevData) => ({
        ...prevData,
        bulkbuy: {
          ...prevData.bulkbuy,
          [category]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    Swal.fire({
      title: 'Enter Username and Password',
      html:
        '<input id="swal-username" class="swal2-input" placeholder="Username">' +
        '<input id="swal-password" class="swal2-input" type="password" placeholder="Password">',
      focusConfirm: false,
      preConfirm: async () => {
        const username = Swal.getPopup().querySelector('#swal-username').value;
        const password = Swal.getPopup().querySelector('#swal-password').value;
  
        try {
          // Send username and password to the server for authentication
          const loginResponse = await axios.post('http://64.227.152.179:8080/weighingSystem-1/weighing/login', {
            username: username,
            password: password,
          });
  
          if (loginResponse.data.status === 'Login successful' ) {
            // Handle successful login
            console.log(loginResponse.status);

            const payload = {
                ...formData              
              };

            try {
              // Send registration data to the server using axios POST request
              const response = await axios.post('http://64.227.152.179:8080/weighingSystem-1/price/save', payload);
  
              // Handle the server response accordingly
              if (response.status === 200) {
                Swal.close();
                // Registration successful, handle success notification or redirect
                Swal.fire({
                  title: 'Success!',
                  text: 'Successfully Added Today Prices',
                  icon: 'success',
                  toast: true, // Use the toast option
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                });
  
                setFormData({
                  exportsell: '',
                  local_no_1sell: '',
                  local_no_2sell: '',
                  grade3sell: '',
                  date: new Date().toISOString().slice(0, 10),
                  bulkbuy: {
                    guava: '',
                    mango: '',
                    banana: '',
                    papaya: '',
                    pomegranate: '',
                  },
                });
  
              } else {
                Swal.fire({
                  title: 'Error!',
                  text: 'Price Update Failed!',
                  icon: 'error',
                  toast: true, // Use the toast option
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                });
              }
            } catch (error) {
              Swal.close();
              // Handle network errors or other issues
              console.error('Error:', error);
              notification.error({
                message: 'Error',
                description: 'failed due to a network error.',
              });
            }
            // End of form submission logic
            
          } else {
            // Handle login failure
            console.log('Login failed');
            Swal.fire({
              title: 'Error!',
              text: 'Wrong Details for login!',
              icon: 'error',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          }
        } catch (error) {
          // Handle network errors or other issues
          console.error('Error:', error);
          Swal.fire({
            title: 'Error!',
            text: 'An unexpected error occurred. Please try again.',
            icon: 'error',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      },
    });
  };
  
  

  return (
    <div className='fullbody'>
      <Header />
      <div className="priceadd-container">
        <div className="priceadd-box">
          <div className="priceadd-header">
            <FontAwesomeIcon icon={faSackDollar} style={{color: "#B197FC",}} className="form-icon-dolar" size="3x" />
            <h2>Daily Prices</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="priceadd-inputs">
              <div className="priceadd-input-group">
                <label className='priceadd-label' htmlFor="export">Export:</label>
                <input 
                  className='priceadd-input'
                  type="text"
                  id="exportsell"
                  name="exportsell"
                  placeholder="Selling price"
                  value={formData.exportsell}
                  onChange={handleChange}
                  required
                />
              </div>
                
              <div className="priceadd-input-group">
                <label className='priceadd-label' htmlFor="local_no_1">Local No 01:</label>
                <input className='priceadd-input'
                  type="text"
                  id="local_no_1sell"
                  name="local_no_1sell"
                  placeholder="Selling price"
                  value={formData.local_no_1sell}
                  onChange={handleChange}
                  required
                />
              </div>  
            
              <div className="priceadd-input-group">
                <label className='priceadd-label' htmlFor="local_no_2">Local No 02:</label>
                <input className='priceadd-input'
                  type="text"
                  id="local_no_2sell"
                  name="local_no_2sell"
                  placeholder="Selling price"
                  value={formData.local_no_2sell}
                  onChange={handleChange}
                  required
                />
              </div>
  
              <div className="priceadd-input-group">
                <label className='priceadd-label' htmlFor="grade3">Grade 03:</label>
                <input className='priceadd-input'
                  type="text"
                  id="grade3sell"
                  name="grade3sell"
                  placeholder="Selling price"
                  value={formData.grade3sell}
                  onChange={handleChange}
                  required
                />
              </div>
          
              <div className="bulkbuy-container">
                <h3>Bulk Buy Prices</h3>
                <div className="bulkbuy-grid">
                  {['Guava', 'Mango', 'Banana', 'Papaya', 'Pomegranate'].map((fruit) => (
                    <div className="priceadd-input-group" key={fruit}>
                      <label className="priceadd-label" htmlFor={`bulkbuy_${fruit.toLowerCase()}`}>{fruit}:</label>
                      <input
                        className="priceadd-input"
                        type="text"
                        id={`bulkbuy_${fruit.toLowerCase()}`}
                        name={`bulkbuy_${fruit.toLowerCase()}`}
                        placeholder={`Enter ${fruit} price`}
                        value={formData.bulkbuy[fruit.toLowerCase()]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
  
              <div className="priceadd-input-group">
                <label className='priceadd-label' htmlFor="date">Date:</label>
                <input 
                  className='priceadd-input'
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}                                    
                  onChange={handleChange}  
                  placeholder="Select Date"
                  required
                />             
              </div>

            </div>
  
            <button type="submit">Add Price</button>
          </form>
        </div>
      </div>
    </div>
  );
  
}

export default PriceAdd;

