import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';  // Use Axios for API requests
import './DashboardPage.css';
import Header from '../components/Header';
import { Chart } from 'chart.js/auto'; // Importing Chart.js for bar charts
import { notification } from 'antd'; // Import notification for error handling


const Dashboard = () => {
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedSalesDate, setSeletedSalesDate] = useState('');
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [isSaleTableVisible, setIsSaleTableVisible] = useState(false);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const chartRef = useRef(null);

  const salesChartRef = useRef(null); // Create a separate reference for the sales chart

  const farmers = [
    { id: '1', farmerName: 'M.R Sirisena', containerNumber: 'hodsgch', date: '2024-08-05', grnNumber: 'hdg', noOfBoxes: 5, trays: 5, weights: [50.15, 55.36, 105.36], total: 210.87, category: 'Guava', disposal: 6.25, goodContent: 202.62, unitPrice: 300 },
    { id: '2', farmerName: 'MK Siripala', containerNumber: '123', date: '2024-01-05', grnNumber: '11', noOfBoxes: 2, trays: 4, weights: [45, 25, 52, 35], total: 157.00, category: 'Banana', disposal: 10.25, goodContent: 146.75, unitPrice: 95.75 },
    { id: '3', farmerName: 'MR Sirisena', containerNumber: '1', date: '2023-12-22', grnNumber: '123', noOfBoxes: 2, trays: 4, weights: [12.25, 21.42, 30.56, 24.25, 21.96], total: 110.44, category: 'Guava', disposal: 12.25, goodContent: 90.19, unitPrice: 340.75 }
  ];

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesFarmer = selectedFarmer ? farmer.farmerName === selectedFarmer : true;
    const matchesCategory = selectedCategory ? farmer.category === selectedCategory : true;
    const matchesDate = selectedDate ? farmer.date === selectedDate : true;

    return matchesFarmer && matchesCategory && matchesDate;
  });

  const sales = [
    { id:'1' , customerName: 'Kamal Nishanth', date: '2024-04-05', export: 10, localNo1: 8, localNo2: 12, grade3: 8, total: 36.00, cost: 1121130 },
    { id:'2', customerName: 'Kamal Nishanth', date: '2023-12-22', export: 10, localNo1: 10, localNo2: 10, grade3: 10, total: 40.00, cost: 124050 },
    { id:'3', customerName: 'AD Sumanwan', date: '2023-12-22', export: 45, localNo1: 20, localNo2: 20, grade3: 10, total: 85.00, cost: 240275 }
  ];

  const filteredSales = sales.filter((sale) =>{
    const matchesCustomer = selectedCustomer ? sale.customerName === selectedCustomer : true ;
    const matchesSalesDate = selectedSalesDate ? sale.date === selectedSalesDate : true;

    return matchesCustomer && matchesSalesDate;
  });
 

  const handleFarmerSelect = (event) => setSelectedFarmer(event.target.value);
  const handleCategorySelect = (event) => setSelectedCategory(event.target.value);
  const handleDateChange = (event) => setSelectedDate(event.target.value);

  const handleCustomerSelect = (event) => setSelectedCustomer(event.target.value);
  const handleDateForSaleChange = (event) => setSeletedSalesDate(event.target.value);

  const toggleTableVisibility = () => setIsTableVisible(!isTableVisible); //Toggle table visibility
  const toggleSaleTableVisibility = () => setIsSaleTableVisible(!isSaleTableVisible); //Toggle Data Table visibility

  // Clean up and update chart whenever the filtered farmers change
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('main-chart').getContext('2d');

    const farmerNames = filteredFarmers.map(farmer => farmer.farmerName);
    const totals = filteredFarmers.map(farmer => farmer.total);
    const goodContents = filteredFarmers.map(farmer => farmer.goodContent);
    const disposals = filteredFarmers.map(farmer => farmer.disposal);

    const chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: farmerNames,
        datasets: [
          { label: 'Total', data: totals, backgroundColor: 'lightblue' },
          { label: 'Good Content', data: goodContents, backgroundColor: 'lightgreen' },
          { label: 'Disposal', data: disposals, backgroundColor: 'red' }
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 1.0, // Adjusted for larger chart with wider distribution
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            font: {
                size: 15
              }            
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                const index = tooltipItem.dataIndex;
                const farmer = filteredFarmers[index];
                return [
                  `Total: ${farmer.total}`,
                  `Good Content: ${farmer.goodContent}`,
                  `Disposal: ${farmer.disposal}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 15 // Smaller font size for x-axis labels
              }
            },
            grid: {
              display: false // Optional: Hide x-axis grid lines for better readability
            },
            barPercentage: 0.6, // Make bars narrower
            categoryPercentage: 0.5 // Increase the spacing between categories for wider distribution
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 15 // Smaller font size for y-axis labels
              }
            }
          }
        }
      }
    });

    chartRef.current = chartInstance;
  }, [filteredFarmers]);

  const getChartData = (sales) => {
    const labels = sales.map((sale) => sale.customerName);
    const datasets = [
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
    ];
  
    return { labels, datasets };
  };

  useEffect(() => {
    // Clean up existing chart instance if any
    if (salesChartRef.current) {
      salesChartRef.current.destroy();
    }
  
    const ctx = document.getElementById('myChart').getContext('2d');  // Canvas for sales chart
    const salesChartData = getChartData(filteredSales); // Get prepared data for sales chart
  
    // Create and configure the sales chart instance (presumably a line chart)
    const salesChartInstance = new Chart(ctx, {
      type: 'line', // Set chart type to line
      data: salesChartData,
      options: {
        responsive: true, // Adjust chart based on screen size
        maintainAspectRatio: false, // Allow better scaling for line chart
        scales: {
          y: {  // Change yAxes to y
            beginAtZero: true,  // Ensure the y-axis starts at zero
            max: 100, // Adjust the max value of the Y-axis (customize based on your data)
            ticks: {
              stepSize: 20,  // Define the interval between Y-axis ticks (adjust as needed)
            },
            font: {
                size: 15
              } 
          },
          x: {  
            font: {
                size: 15
              }
          }
          // plugins: {
            // legend: {
            //   // position: 'bottom', //Move legend to the bottom
            // }
          
        }
      }
    });
  
    salesChartRef.current = salesChartInstance;
  }, [filteredSales]); // Update sales chart on changes in filteredSales

  return (
    <div className="dashboardPage-container">
      <Header />
      <div className="filter-row">
        <div className="dropdown-container">
          <select id="farmer-select" value={selectedFarmer} onChange={handleFarmerSelect}>
            <option value="">Select Farmer</option>
            {farmers.map((farmer) => (
              <option key={farmer.id} value={farmer.farmerName}>
                {farmer.farmerName}
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
      <div className="chart-container">
        <div className="chart-box">
          <canvas id="main-chart"></canvas>
        </div>
      </div>

      {/* Toggle button for farmer table */}
      <button className='toggle-button' onClick={toggleTableVisibility}>
      {isTableVisible? 'Hide Table' : 'Show Table'}
      </button>

      {isTableVisible && filteredFarmers.length > 0 ? (
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
              {filteredFarmers.map((farmer) => (
                <tr key={farmer.id}>
                  <td>{farmer.farmerName}</td>
                  <td>{farmer.containerNumber}</td>
                  <td>{farmer.date}</td>
                  <td>{farmer.grnNumber}</td>
                  <td>{farmer.category}</td>
                  <td>{farmer.noOfBoxes}</td>
                  <td>{farmer.total}</td>
                  <td>{farmer.trays}</td> {/* Add this new column data */}
                  <td>{farmer.weights.join(', ')}</td> {/* Display weights as comma-separated string */}
                  <td>{farmer.disposal}</td>  {/* Add this new column data */}
                  <td>{farmer.goodContent}</td>  {/* Add this new column data */}
                  <td>{farmer.unitPrice}</td>  {/* Add this new column data */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        isTableVisible && filteredFarmers.length === 0 && <p className= 'no-farmers-found-message'>No farmers found matching the selected filters.</p>
        )} 

      <div className="filter-row">
          <div className="dropdown-container">
            <select id="custmer-select" value={selectedCustomer} onChange={handleCustomerSelect}>
              <option value="">Select Customer</option>
              {sales.map((sale) => (
                <option key={sale.id} value={sale.customerName}>
                  {sale.customerName}
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
          <canvas id="myChart"></canvas>
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
