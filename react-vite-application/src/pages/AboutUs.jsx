import React from 'react';
import './aboutus.css';
import Header from '../components/Header';



const AboutUs = () => {
  return (
    <div >
            <Header/>
    <div className='fullbody'>
    
        
    <div className="about-us-container">
      <h2>Welcome to Sanota (Private) Limited</h2>
              <div className="image-container">
              <img src="sanota-logo.png" alt="Sanota Logo" />
              </div>
      <p>
        Sanota is a manufacturing and engineering services providing company offering a range of specialized services
        in many technological areas. Founded in 2010 by Mr. Sahan C. Ranasinghe, an Engineer from the University of
        Moratuwa in Sri Lanka, Sanota aims to identify issues and facilitate technical products to every industry.
        Through the support of talented expertise in Sri Lanka, Sanota has evolved into a high-tech equipment provider,
        fulfilling its founder's dream.
      </p>

      <h3>Vision</h3>
      <p>
        "Customer satisfaction is the measurement of success. It is the most valuable profit we gain from the
        business."
      </p>

      <h3>Mission</h3>
      <p>
        "To be the best provider of engineering-related products and services in an environmentally friendly manner
        which deliver long-term commercial benefits, based upon our clients' key requirements."
      </p>

      <h3>Company Details</h3>
      <ul>
        <li><strong>Registered Name:</strong> SANOTA (PRIVATE) LIMITED</li>
        <li><strong>Registered No:</strong> PV 74540</li>
        <li><strong>Year Established:</strong> 2010</li>
      </ul>
    </div>
    </div>
    </div>
  );
};

export default AboutUs;
