import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faPenToSquare, faDownload, faPrint, faSearch } from '@fortawesome/free-solid-svg-icons';
import './FarmersListPage.css';
import QRCode from 'react-qr-code';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Sample farmer data
const farmersData = [
  { id: 'F001', firstName: 'John', lastName: 'Doe', idNumber: '789456123V', contactNumber: '0771234567', growingArea: 'Area 1', fieldSize: '2 Acres', fruitCategory: 'Apple' },
  { id: 'F002', firstName: 'Jane', lastName: 'Smith', idNumber: '789456124V', contactNumber: '0771234568', growingArea: 'Area 2', fieldSize: '3 Acres', fruitCategory: 'Orange' },
  { id: 'F003', firstName: 'Saman', lastName: 'Gamage', idNumber: '651784659V', contactNumber: '0771234567', growingArea: 'Area 3', fieldSize: '2 Acres', fruitCategory: 'Guava' }
];

function FarmerList() {
  const [qrData, setQrData] = useState('');
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [farmers, setFarmers] = useState(farmersData);
  const [searchTerm, setSearchTerm] = useState('');

  const generateQrCode = (farmer) => {
    const qrString = `ID: ${farmer.id}, Name: ${farmer.firstName} ${farmer.lastName}, Contact: ${farmer.contactNumber}, Growing Area: ${farmer.growingArea}, Field Size: ${farmer.fieldSize}, Fruit Category: ${farmer.fruitCategory}`;
    setQrData(qrString);
    setIsQrVisible(true); // Show the QR code section
  };

  const downloadQR = () => {
    const svg = document.getElementById('qrCanvas');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.createElement('img');
    img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(svgData));
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.href = pngFile;
      downloadLink.download = `${qrData.split(',')[0].split(': ')[1]}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
  };

  const printQR = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <h3>QR Code</h3>
            <div id="qrToPrint">${document.getElementById('qrCanvas').outerHTML}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
  };

  const handleUpdateClick = (farmer) => {
    setSelectedFarmer(farmer);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFarmer((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFarmers((prevFarmers) =>
      prevFarmers.map((farmer) =>
        farmer.id === selectedFarmer.id ? selectedFarmer : farmer
      )
    );
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.lastName.toLowerCase().includes(searchTerm.toLowerCase())    
  );

  return (
    <div className="farmer-list-page-container">
      <Header />
      <div className={`farmer-list-container ${isModalOpen ? 'blur-background' : ''}`}>
        <h2>Farmer List</h2>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search farmers"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        <div className='table-container'>
          <table>
            <thead>
              <tr>
                <th>Farmer ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>ID Number</th>
                <th>Contact Number</th>
                <th>Growing Area</th>
                <th>Field Size</th>
                <th>Fruit Category</th>
                <th>QR Generate</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((farmer) => (
                <tr key={farmer.id}>
                  <td>{farmer.id}</td>
                  <td>{farmer.firstName}</td>
                  <td>{farmer.lastName}</td>
                  <td>{farmer.idNumber}</td>
                  <td>{farmer.contactNumber}</td>
                  <td>{farmer.growingArea}</td>
                  <td>{farmer.fieldSize}</td>
                  <td>{farmer.fruitCategory}</td>
                  <td>
                    <button onClick={() => generateQrCode(farmer)}>
                      <FontAwesomeIcon icon={faQrcode} />
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleUpdateClick(farmer)}>
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* QR Code Section with space allocated */}
        <div className={`qr-section ${isQrVisible ? 'visible' : ''}`}>
          {isQrVisible && (
            <>
              <QRCode
                id="qrCanvas"
                value={qrData}
                size={128}
                bgColor="#ffffff"
                fgColor="#000000"
              />
              <div className="btn-container">
                <button onClick={downloadQR} className="download-print-btns">
                  <FontAwesomeIcon icon={faDownload} />
                </button>
                <button onClick={printQR} className="download-print-btns">
                  <FontAwesomeIcon icon={faPrint} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && selectedFarmer && (
        <div className="modal-container">
          <div className="modal-content">  
            <h3>Edit Farmer</h3>           
            <form onSubmit={handleFormSubmit} className="form">
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={selectedFarmer.firstName}
                  onChange={handleInputChange}
                  className="input-field"  
                />
              </div>

              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={selectedFarmer.lastName}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>ID Number:</label>
                <input
                  type="text"
                  name="idNumber"
                  value={selectedFarmer.idNumber}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Contact Number:</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={selectedFarmer.contactNumber}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Growing Area:</label>
                <input
                  type="text"
                  name="growingArea"
                  value={selectedFarmer.growingArea}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Field Size:</label>
                <input
                  type="text"
                  name="fieldSize"
                  value={selectedFarmer.fieldSize}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Fruit Category:</label>
                <input
                  type="text"
                  name="fruitCategory"
                  value={selectedFarmer.fruitCategory}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="button-group">
                <button type="submit" className="submit-btn">OK</button>
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default FarmerList;
