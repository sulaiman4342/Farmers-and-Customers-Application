import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import './DashboardPage.css';
import Header from '../components/Header';
import { notification } from 'antd';


const Dashboard = () => {
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedSalesDate, setSeletedSalesDate] = useState('');
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [isSaleTableVisible, setIsSaleTableVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const user_id = parseInt(localStorage.getItem('user_id'), 10);  
  const recordsPerPage = 4;
  
  const [farmers, setFarmers] = useState([]);
  const [sales, setSales] = useState([]);

  //Fetch farmers data from API
  useEffect(() => {
    axios.get('http://64.227.152.179:8080/weighingSystem-1/data/all')
      .then(response => {
        const filteredData = response.data.filter(item => item.supplier.user_id === user_id);
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
        }));
        setFarmers(formattedFarmers);
      })
      .catch(error => {
        console.error('Error fetching farmers data', error);
        notification.error({
          message: 'Error!',
          description: 'Error loading farmers data from the server.',
        });
      });
  }, [user_id]);
  
    // Fetch sales data from API
    useEffect(() => {
      axios.get('http://64.227.152.179:8080/weighingSystem-1/stocksell/all')
        .then(response => {
          const filteredSalesData = response.data.filter(item => item.seller.users.id === user_id);
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
          }));
          setSales(formattedSales);
        })
        .catch(error => {
          console.error('Error fetching sales data:', error);
          notification.error({
            message: 'Error!',
            description: 'Error loading sales data from the server.',
          });
        });
    }, [user_id])

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
  const handleDateForSaleChange = (event) => setSeletedSalesDate(event.target.value);

  const toggleTableVisibility = () => setIsTableVisible(!isTableVisible); //Toggle table visibility
  const toggleSaleTableVisibility = () => setIsSaleTableVisible(!isSaleTableVisible); //Toggle Data Table visibility

  const getPaginatedFarmers = () => {
    const startIndex = currentPage * recordsPerPage;
    return filteredFarmers.slice(startIndex, startIndex + recordsPerPage);
  };

  const nextPage = () => {
    if ((currentPage + 1) * recordsPerPage < filteredFarmers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedFarmers = getPaginatedFarmers();  

  // const getChartData = (sales) => {
  //   const labels = sales.map((sale) => sale.customerName);
  //   const datasets = [
  //     {
  //       label: 'Total',
  //       data: sales.map((sale) => sale.total),
  //       borderColor: 'blue',
  //       backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //     },
  //     {
  //       label: 'Local No 1',
  //       data: sales.map((sale) => sale.localNo1),
  //       borderColor: 'green',
  //       backgroundColor: 'rgba(54, 162, 235, 0.2)',
  //     },
  //     {
  //       label: 'Local No 2',
  //       data: sales.map((sale) => sale.localNo2),
  //       borderColor: 'orange',
  //       backgroundColor: 'rgba(255, 159, 64, 0.2)',
  //     },
  //     {
  //       label: 'Grade',
  //       data: sales.map((sale) => sale.grade3),
  //       borderColor: 'red',
  //       backgroundColor: 'rgba(255, 206, 86, 0.2)',
  //     },
  //     {
  //       label: 'Export',
  //       data: sales.map((sale) => sale.export),
  //       borderColor: 'purple',
  //       backgroundColor: 'rgba(153, 102, 255, 0.2)',
  //     },
  //   ];
  
  //   return { labels, datasets };
  // };

  // useEffect(() => {
  //   // Clean up existing chart instance if any
  //   if (salesChartRef.current) {
  //     salesChartRef.current.destroy();
  //   }
  
  //   const ctx = document.getElementById('myChart').getContext('2d');  // Canvas for sales chart
  //   const salesChartData = getChartData(filteredSales); // Get prepared data for sales chart
  
  //   // Create and configure the sales chart instance (presumably a line chart)
  //   const salesChartInstance = new Chart(ctx, {
  //     type: 'line', // Set chart type to line
  //     data: salesChartData,
  //     options: {
  //       responsive: true, // Adjust chart based on screen size
  //       maintainAspectRatio: false, // Allow better scaling for line chart
  //       scales: {
  //         y: {  // Change yAxes to y
  //           beginAtZero: true,  // Ensure the y-axis starts at zero
  //           max: 1000, // Adjust the max value of the Y-axis (customize based on your data)
  //           ticks: {
  //             stepSize: 20,  // Define the interval between Y-axis ticks (adjust as needed)
  //           },
  //           font: {
  //               size: 15
  //             } 
  //         },
  //         x: {  
  //           font: {
  //               size: 15
  //             }
  //         }
  //         // plugins: {
  //           // legend: {
  //           //   // position: 'bottom', //Move legend to the bottom
  //           // }
          
  //       }
  //     }
  //   });
  
  //   salesChartRef.current = salesChartInstance;
  // }, [filteredSales]); // Update sales chart on changes in filteredSales

  const lineChartData = {
    labels: filteredSales.map((sale) => sale.customerName),
    datasets: [
      {
        label: 'Total',
        data: sales.map((sale) => sale.total),
        borderColor: 'blue',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Local No 1',
        data: sales.map((sale) => sale.localNo1),
        borderColor: 'green',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Local No 2',
        data: sales.map((sale) => sale.localNo2),
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
      },
      {
        label: 'Grade',
        data: sales.map((sale) => sale.grade3),
        borderColor: 'red',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
      },
      {
        label: 'Export',
        data: sales.map((sale) => sale.export),
        borderColor: 'purple',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  return (
    <div className="dashboardPage-container">
      <Header />
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
              <button onClick={prevPage} disabled={currentPage === 0}> &larr; </button>
              <span> {currentPage + 1} </span>
              <button onClick={nextPage} disabled={(currentPage + 1) * recordsPerPage >= filteredFarmers.length}> &rarr;</button>
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
          <LineChart chartData={lineChartData} />
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
              {filteredSales.map((sale) => (
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
        </div>
      ) : (
        isSaleTableVisible && filteredSales.length === 0 && <p className='no-sales-found-message'>No sales found matching the selected filters.</p>
        )}        
    </div>
  );
};

export default Dashboard;
