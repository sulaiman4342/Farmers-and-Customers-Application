import { useState, useEffect  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import './DashboardPage.css';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { notification } from 'antd';

const Dashboard = () => {
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedSalesDate, setSelectedSalesDate] = useState('');
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [isSaleTableVisible, setIsSaleTableVisible] = useState(false);
  const [farmerPage, setFarmerPage] = useState(0); // For farmers pagination
  const [salesPage, setSalesPage] = useState(0); // For sales pagination

  const { user_id } = useParams();
  const parsedUserId = parseInt(user_id, 10);
  const navigate = useNavigate(); // For navigation


  const farmerRecordsPerPage = 5; // Separate limit for farmers (BarChart)
  const salesRecordsPerPage = 9; // Separate limit for sales (LineChart)
  
  const [farmers, setFarmers] = useState([]);
  const [sales, setSales] = useState([]);

  // Fetch user role
  const userRole = localStorage.getItem('userRole'); // Check user role from localStorage
  const isAdmin = userRole === 'ADMIN'; // Boolean for admin status

  //Fetch farmers data from API
  useEffect(() => {
    axios.get('http://64.227.152.179:8080/weighingSystem-1/data/all')
      .then(response => {
        const filteredData = response.data.filter(item => item.supplier.user_id === parsedUserId);
        const formattedFarmers = filteredData.map(item => ({
          id: item.stock_id,
          farmerName: `${item.supplier.firstname} ${item.supplier.lastname}`,
          containerNumber: item.containerNumber,
          date: item.date,
          grnNumber: item.grnnumber,
          noOfBoxes: item.noofbox,
          trays: item.trays,
          weights: item.weights.map(w => w.weight),
          total: parseFloat(item.total),
          category: item.supplier.category,
          disposal: item.disposal ? parseFloat(item.disposal) : 0,
          goodContent: item.goodcontent ? parseFloat(item.goodcontent) : parseFloat(item.total),
          unitPrice: parseFloat(item.unitprice),
        }))
        .reverse(); // Reverse the data to show latest first;
        setFarmers(formattedFarmers);
      })
      .catch(error => {
        console.error('Error fetching farmers data', error);
        notification.error({
          message: 'Error!',
          description: 'Error loading farmers data from the server.',
        });
      });
  }, [parsedUserId]);
  
  // Fetch sales data from API
  useEffect(() => {
    axios.get('http://64.227.152.179:8080/weighingSystem-1/stocksell/all')
      .then(response => {
        const filteredSalesData = response.data.filter(item => item.seller.users.id === parsedUserId);
        const formattedSales = filteredSalesData.map(item => ({
          id: item.id,
          customerName: item.sellername,
          date: item.date,
          export: item.export,
          localNo1: item.local_no_1,
          localNo2: item.local_no_2,
          grade3: item.grade3,
          total: item.total,
          cost: item.cost,
        }))
        .reverse(); // Reverse the data to show latest first;
        setSales(formattedSales);
      })
      .catch(error => {
        console.error('Error fetching sales data:', error);
        notification.error({
          message: 'Error!',
          description: 'Error loading sales data from the server.',
        });
      });
  }, [parsedUserId])

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesFarmer = selectedFarmer ? farmer.farmerName === selectedFarmer : true;
    const matchesCategory = selectedCategory ? farmer.category === selectedCategory : true;
    const matchesDate = selectedDate ? farmer.date === selectedDate : true;

    return matchesFarmer && matchesCategory && matchesDate;
  });

  const filteredSales = sales.filter((sale) =>{
    const matchesCustomer = selectedCustomer ? sale.customerName === selectedCustomer : true ;
    const matchesSalesDate = selectedSalesDate ? sale.date === selectedSalesDate : true;

    return matchesCustomer && matchesSalesDate;
  });
  
  const uniqueSellers = [...new Set(sales.map(sale => sale.customerName))];

  const handleFarmerSelect = (event) => setSelectedFarmer(event.target.value);
  const handleCategorySelect = (event) => setSelectedCategory(event.target.value);
  const handleDateChange = (event) => setSelectedDate(event.target.value);

  const handleCustomerSelect = (event) => setSelectedCustomer(event.target.value);
  const handleDateForSaleChange = (event) => setSelectedSalesDate(event.target.value);

  const toggleTableVisibility = () => setIsTableVisible(!isTableVisible); //Toggle table visibility
  const toggleSaleTableVisibility = () => setIsSaleTableVisible(!isSaleTableVisible); //Toggle Data Table visibility

  
  // Paginate farmers and sales data
  const getPaginatedData = (data, page, limit) => {
    const startIndex = page * limit;
    return data.slice(startIndex, startIndex + limit);
  };

  const nextPage = (setPage, data, limit) => {
    setPage((prevPage) =>
      (prevPage + 1) * limit < data.length ? prevPage + 1 : prevPage
    );
  };

  const prevPage = (setPage) => {
    setPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage));
  };

  const paginatedFarmers = getPaginatedData(filteredFarmers, farmerPage, farmerRecordsPerPage);
  const paginatedSales = getPaginatedData(filteredSales, salesPage, salesRecordsPerPage);

  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage items
    navigate('/'); // Redirect to login page
  };

  const handleBack = () => {
    navigate('/adminUserView'); // Redirect back to admin user view
  };

  return (
    <div className="dashboardPage-container">
      {/* Display Header for USERS only */}
      {!isAdmin && <Header />}

      {/* Display Back and Logout Buttons for ADMINS */}
      {isAdmin && (
        <div className="admin-controls">
          <button onClick={handleBack} className="admin-back-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button onClick={handleLogout} className="admin-logout-button">
            Logout
          </button>
        </div>
      )}

      {isAdmin && <h2 style={{ margin: '35px auto' }}>Admin View: User Dashboard for ID {user_id}</h2>}

      <div className="filter-row">
        <div className="dropdown-container">
          <select id="farmer-select" value={selectedFarmer} onChange={handleFarmerSelect}>
            <option value="">Select Farmer</option>
            {[...new Set(farmers.map((farmer) => farmer.farmerName))].map((farmerName, index) => (
              <option key={index} value={farmerName}>
                {farmerName}
              </option>
            ))}
          </select>

          <select id="category-select" value={selectedCategory} onChange={handleCategorySelect}>
            <option value="">Select Category</option>
            {[...new Set(farmers.map(farmer => farmer.category))].map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="date"
            id="date-picker"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* Main chart container */}
      <div className="chart-container" style={{ overflowX: 'scroll' }}>
        <div className="chart-box">
          <BarChart chartData={paginatedFarmers} />
        </div>
      </div>

      {/* Toggle button for farmer table */}
      <button className='toggle-button' onClick={toggleTableVisibility}>
        {isTableVisible? 'Hide Table' : 'Show Table'}
      </button>

      {isTableVisible && filteredFarmers.length > 0 ? (
        <div>
          <div className='farmer-details'>
            <table className="farmer-table"> 
              <thead>
                <tr>
                  <th>Farmer Name</th>
                  <th>Container Number</th>
                  <th>Date</th>
                  <th>GRN Number</th>
                  <th>Category</th>
                  <th>No of Boxes</th>
                  <th>Total Weight</th>
                  <th>Trays</th>  
                  <th>Weights</th>  
                  <th>Disposal</th>  
                  <th>Good Content</th>  
                  <th>Unit Price</th>  
                </tr>
              </thead>
              <tbody>
                  {paginatedFarmers.map((farmer) => (
                  <tr key={farmer.id}>
                    <td>{farmer.farmerName}</td>
                    <td>{farmer.containerNumber}</td>
                    <td>{farmer.date}</td>
                    <td>{farmer.grnNumber}</td>
                    <td>{farmer.category}</td>
                    <td>{farmer.noOfBoxes}</td>
                    <td>{farmer.total}</td>
                    <td>{farmer.trays}</td> 
                    <td>{farmer.weights.join(', ')}</td> {/* Display weights as comma-separated string */}
                    <td>{farmer.disposal}</td>  
                    <td>{farmer.goodContent}</td>  
                    <td>{farmer.unitPrice}</td>  
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination-controls">
              <button onClick={() => prevPage(setFarmerPage)} disabled={farmerPage === 0}> &larr; </button>
              <span> {farmerPage + 1} </span>
              <button onClick={() => nextPage(setFarmerPage, filteredFarmers, farmerRecordsPerPage)} disabled={(farmerPage + 1) * farmerRecordsPerPage >= filteredFarmers.length}> &rarr;</button>
            </div>
          </div>          
        </div>
      ) : (
        isTableVisible && filteredFarmers.length === 0 && <p className= 'no-farmers-found-message'>No farmers found matching the selected filters.</p>
        )} 

      <div className="filter-row">
          <div className="dropdown-container">
            <select id="custmer-select" value={selectedCustomer} onChange={handleCustomerSelect}>
              <option value="">Select Customer</option>
              {uniqueSellers.map((customerName) => (
                <option key={customerName} value={customerName}>
                  {customerName}
                </option>
              ))}
            </select>

            <input
              type="date"
              id="date-picker"
              value={selectedSalesDate}
              onChange={handleDateForSaleChange}
            />
          </div>
      </div>

      <div className="chart-container">
        <div className='line-chart-box'>
          <LineChart chartData={paginatedSales} />
        </div>
      </div>
      
      <button className='toggle-button-bottom' onClick={toggleSaleTableVisibility}>
      {isSaleTableVisible ? 'Hide Table' : 'Show Table'}
      </button>

      {isSaleTableVisible && filteredSales.length > 0 ? (
        <div className='sales-details' style={{ marginBottom: '5px' }}> 
          <table className="sales-table"> 
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Export</th>
                <th>Local No 1</th>
                <th>Local No 2</th>
                <th>Grade 3</th>
                <th>Total</th>
                <th>Cost</th> 
              </tr>
            </thead>
            <tbody>
              {paginatedSales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.customerName}</td>
                  <td>{sale.date}</td>
                  <td>{sale.export}</td>
                  <td>{sale.localNo1}</td>
                  <td>{sale.localNo2}</td>
                  <td>{sale.grade3}</td> 
                  <td>{sale.total}</td>
                  <td>{sale.cost}</td> 
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-controls">
              <button onClick={() => prevPage(setSalesPage)} disabled={salesPage === 0}> &larr; </button>
              <span> {salesPage + 1} </span>
              <button onClick={() => nextPage(setSalesPage, filteredSales, salesRecordsPerPage)} disabled={(salesPage + 1) * salesRecordsPerPage >= filteredSales.length}> &rarr;</button>
            </div>
        </div>
      ) : (
        isSaleTableVisible && filteredSales.length === 0 && <p className='no-sales-found-message'>No sales found matching the selected filters.</p>
        )}        
    </div>
  );
};

export default Dashboard;
