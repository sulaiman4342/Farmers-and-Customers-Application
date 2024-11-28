import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faPenToSquare, faDownload, faPrint, faSearch } from '@fortawesome/free-solid-svg-icons';
import './FarmersListPage.css';
import Swal from 'sweetalert2';
import QRCode from 'react-qr-code';
import Header from '../components/Header';
import axios from 'axios';

const FarmerList = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [qrData, setQrData] = useState([]);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const user_id =  parseInt(localStorage.getItem('user_id'), 10); // Get user ID from local storage

  useEffect(() => {
    fetchFarmers();
  }, []);

  // Fetch farmer data from backend
  const fetchFarmers = () => {
    axios
      .get(`http://64.227.152.179:8080/weighingSystem-1/supplier/all`)
      .then((response) => {
        const filteredData = response.data.filter((farmer) => farmer.user_id === user_id)
        .map((farmer) => ({
          id: farmer.id,
          firstName: farmer.firstname,
          lastName: farmer.lastname,
          idNumber: farmer.idnumber,
          contactNumber: farmer.connumber,
          growingArea: farmer.area,
          fieldSize: farmer.size,
          fruitCategory: farmer.category,
          formattedShowId: farmer.formattedShowId,
        }));
        setFarmers(filteredData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching farmer data:', error);
        setLoading(false);
        Swal.fire('Error!', 'Failed to load farmer data', 'error');
      });
  };

  const generateQrCode = (farmer) => {
    setQrData({
      id: farmer.id,
      firstName: farmer.firstName,
      lastName: farmer.lastName,
      idNumber: farmer.idNumber,
      contactNumber: farmer.contactNumber,
      growingArea: farmer.growingArea,
      fieldSize: farmer.fieldSize,
      fruitCategory: farmer.fruitCategory,
      formattedShowId: farmer.formattedShowId,
    });
    setIsQrVisible(true);
  };

  const downloadQR = () => {
    const svg = document.getElementById('qrCanvas');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngFile;
      link.download = `farmer_${qrData.id}.png`;
      link.click();
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
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .qr-code-container {
            display: flex;
            border: 1px solid #ccc;
            width: 70%;
            padding: 10px;
            justify-content: space-between;
          }
          .left-section, .right-section {
            flex: 1;
            text-align: center;
          }
          .right-section {
            background-color: #f4f4f4;
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="qr-code-container">
          <div class="left-section">
            <h3>Farmer QR Code</h3>
            ${document.getElementById('qrCanvas').outerHTML}
            <p>ID: ${qrData.formattedShowId || 'N/A'}</p>
          </div>
          <div class="right-section">
            <h2>Farmer Name: ${qrData.firstName} ${qrData.lastName}</h3>
            <h3>NIC: ${qrData.idNumber || 'N/A'}</h3>
            <br><br><br><br><br>
            <p>www.sanotaglobal.com</p>
          </div>
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
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make PUT request to update data on the backend
      await axios.put(
        `http://64.227.152.179:8080/weighingSystem-1/supplier/${selectedFarmer.id}`,
        {
          firstname: selectedFarmer.firstName,
          lastname: selectedFarmer.lastName,
          idnumber: selectedFarmer.idNumber,
          connumber: selectedFarmer.contactNumber,
          area: selectedFarmer.growingArea,
          size: selectedFarmer.fieldSize,
          category: selectedFarmer.fruitCategory,
        }
      );

      // Update the data in the local state
      setFarmers((prevFarmers) =>
        prevFarmers.map((farmer) =>
          farmer.id === selectedFarmer.id ? selectedFarmer : farmer
        )
      );
      
      setIsModalOpen(false);
      Swal.fire('Success!', 'Farmer updated successfully', 'success');
    } catch (error) {
      console.error('Error updating farmer data:', error);
      Swal.fire('Error!', 'Failed to update farmer data', 'error');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFarmers = farmers.filter((farmer) =>
    (farmer.firstName && farmer.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (farmer.lastName && farmer.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="farmer-list-page-container">
      <Header />
      <div className={`farmer-list-container ${isModalOpen ? 'blur-background' : ''}`}>
        <h2>Farmer List</h2>

        {/* Search Bar */}
        <div className="search-bar-farmer-page">
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
              {filteredFarmers.map((farmer) => (
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
                value={JSON.stringify(qrData)}
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
                <select
                  name="fruitCategory"
                  value={selectedFarmer.fruitCategory}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="Banana">Banana</option>
                  <option value="Papaya">Papaya</option>
                  <option value="Mango">Mango</option>
                  <option value="Guava">Guava</option>
                  <option value="Pomegranate">Pomegranate</option>
                </select>
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
