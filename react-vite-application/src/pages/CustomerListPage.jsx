import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faPenToSquare, faDownload, faPrint, faSearch } from '@fortawesome/free-solid-svg-icons';
import QRCode from 'react-qr-code';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './CustomerListPage.css';

// Sample customer data
const customersData = [
  { id: '2312220002', firstName: 'A.D', lastName: 'Sumanesiri', idNumber: '631681419V', contactNumber: '0771234567' },
  { id: '2312220003', firstName: 'Saman', lastName: 'Gamage', idNumber: '651784659V', contactNumber: '0771234567' },
  { id: '2312220004', firstName: 'Kamal', lastName: 'Nishanth', idNumber: '781964790V', contactNumber: '0771234567' },
];

function CustomerList() {
  const [qrData, setQrData] = useState('');
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState(customersData);
  const [searchTerm, setSearchTerm] = useState('');

  const generateQrCode = (customer) => {
    const qrString = `ID: ${customer.id}, Name: ${customer.firstName} ${customer.lastName}, Contact: ${customer.contactNumber}`;
    setQrData(qrString);
    setIsQrVisible(true);
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

  const handleUpdateClick = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setCustomers((prevCustomers) =>
      prevCustomers.map((cust) =>
        cust.id === selectedCustomer.id ? selectedCustomer : cust
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

  const filteredCustomers = customers.filter((customer) =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <div className="customer-list-page-container">
      <Header />
      <div className={`customer-list-container ${isModalOpen ? 'blur-background' : ''}`}>
        <h2>Customer List</h2>

        {/* Search Bar */}
        <div className="search-bar-customer-page">
          <input
            type="text"
            placeholder="Search Customer"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>ID Number</th>
                <th>Contact Number</th>
                <th>QR Generate</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.firstName}</td>
                  <td>{customer.lastName}</td>
                  <td>{customer.idNumber}</td>
                  <td>{customer.contactNumber}</td>
                  <td>
                    <button onClick={() => generateQrCode(customer)}>
                      <FontAwesomeIcon icon={faQrcode} />
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleUpdateClick(customer)}>
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isQrVisible && (
          <div className={`qr-section ${isQrVisible ? 'visible':''}`}>
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
          </div>
        )}
      </div>

      {isModalOpen && selectedCustomer && (
        <div className="modal-container">
          <div className="modal-content">
            <div>
              <h3>Edit Customer</h3>           
            </div>
            <form onSubmit={handleFormSubmit} className="form">
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={selectedCustomer.firstName}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={selectedCustomer.lastName}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>ID Number:</label>
                <input
                  type="text"
                  name="idNumber"
                  value={selectedCustomer.idNumber}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Contact Number:</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={selectedCustomer.contactNumber}
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

export default CustomerList;
