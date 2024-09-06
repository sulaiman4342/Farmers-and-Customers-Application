import React, { useState, useEffect, useRef } from 'react';
import './DashboardPage.css';
import Header from '../components/Header';
import { Chart } from 'chart.js/auto'; // Importing Chart.js for bar charts

const Dashboard = () => {
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const chartRef = useRef(null);  // Single chart reference

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

  const handleFarmerSelect = (event) => setSelectedFarmer(event.target.value);
  const handleCategorySelect = (event) => setSelectedCategory(event.target.value);
  const handleDateChange = (event) => setSelectedDate(event.target.value);

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
        aspectRatio: 3.0, // Adjusted for larger chart with wider distribution
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 7 // Smaller font size for the legend labels
              }
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
                size: 14 // Smaller font size for x-axis labels
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
                size: 13 // Smaller font size for y-axis labels
              }
            }
          }
        }
      }
    });

    chartRef.current = chartInstance;
  }, [filteredFarmers]);

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

      {filteredFarmers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Farmer Name</th>
              <th>Container Number</th>
              <th>Date</th>
              <th>GRN Number</th>
              <th>Category</th>
              <th>No of Boxes</th>
              <th>Total Weight</th>
              <th>Trays</th>  {/* Add this new column header */}
              <th>Weights</th>  {/* Add this new column header */}
              <th>Disposal</th>  {/* Add this new column header */}
              <th>Good Content</th>  {/* Add this new column header */}
              <th>Unit Price</th>  {/* Add this new column header */}
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
      ) : (
         <p>No farmers found matching the selected filters.</p>
        )}      
    </div>
  );
};

export default Dashboard;
