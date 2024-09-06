import React, { useState, useEffect, useRef } from 'react';
import './DashboardPage.css';
import Header from '../components/Header';
import { Chart } from 'chart.js/auto'; // Importing Chart.js for bar charts

const Dashboard = () => {
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const chartRefs = useRef([]);  // Array to store chart instances

  const farmers = [
    { id: '1', farmerName: 'M.R Sirisena', containerNumber: 'hodsgch', date: '2024-08-05', grnNumber: 'hdg', noOfBoxes: 5, trays: 5, weights: [50.15, 55.36, 105.36], total: 210.87, category: 'Guava', disposal: 6.25, goodContent: 202.62, unitPrice: 300 },
    { id: '2', farmerName: 'MK Siripala', containerNumber: '123', date: '2024-01-05', grnNumber: '11', noOfBoxes: 2, trays: 4, weights: [45, 25, 52, 35], total: 157.00, category: 'Banana', disposal: 10.25, goodContent: 146.75, unitPrice: 95.75 },
    { id: '3', farmerName: 'MR Sirisena', containerNumber: '1', date: '2023-12-22', grnNumber: '123', noOfBoxes: 2, trays: 4, weights: [12.25, 21.42, 30.56, 24.25, 21.96], total: 110.44, category: 'Guava', disposal: 12.25, goodContent: 90.19, unitPrice: 340.75 }
  ];

  // Filter logic based on selected farmer, category, and date
  const filteredFarmers = farmers.filter((farmer) => {
    const matchesFarmer = selectedFarmer ? farmer.farmerName === selectedFarmer : true;
    const matchesCategory = selectedCategory ? farmer.category === selectedCategory : true;
    const matchesDate = selectedDate ? farmer.date === selectedDate : true;

    return matchesFarmer && matchesCategory && matchesDate;
  });

  // Event handlers
  const handleFarmerSelect = (event) => setSelectedFarmer(event.target.value);
  const handleCategorySelect = (event) => setSelectedCategory(event.target.value);
  const handleDateChange = (event) => setSelectedDate(event.target.value);

  // Clean up the chart instances before re-rendering
  useEffect(() => {
    chartRefs.current.forEach((chartInstance) => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    });
    chartRefs.current = []; // Reset chart refs to avoid memory leak

    farmers.forEach((farmer, index) => {
      const ctx = document.getElementById(`chart-${index}`).getContext('2d');
      
      const chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [farmer.farmerName],
          datasets: [
            { label: 'Total', data: [farmer.total], backgroundColor: 'lightblue' },
            { label: 'Good Content', data: [farmer.goodContent], backgroundColor: 'lightgreen' },
            { label: 'Disposal', data: [farmer.disposal], backgroundColor: 'red' }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,  // Maintain the default aspect ratio
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      // Store chart instance to destroy it later if necessary
      chartRefs.current.push(chartInstance);
    });
  }, [farmers]); // Only re-run this effect when filteredFarmers change

  return (
    <div className="dashboardPage-container">
      <Header />
      <div className="filter-row">
        <div className="dropdown-container">
          {/* Farmer Dropdown */}
          <select id="farmer-select" value={selectedFarmer} onChange={handleFarmerSelect}>
            <option value="">Select Farmer</option>
            {farmers.map((farmer) => (
              <option key={farmer.id} value={farmer.farmerName}>
                {farmer.farmerName}
              </option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select id="category-select" value={selectedCategory} onChange={handleCategorySelect}>
            <option value="">Select Category</option>
            {[...new Set(farmers.map(farmer => farmer.category))].map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Date Picker */}
          <input
            type="date"
            id="date-picker"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* Chart container */}
      <div className="chart-container">
        {filteredFarmers.map((farmer, index) => (
          <div key={farmer.id} className="chart-box">
            <canvas id={`chart-${index}`}></canvas>
            {/* Tooltip */}
            <div className="tooltip-box">
              <strong>{farmer.farmerName}</strong><br />
              Total: {farmer.total}<br />
              Good Content: {farmer.goodContent}<br />
              Disposal: {farmer.disposal}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="legend-container">
        <div className="legend-item">
          <div className="legend-color legend-total"></div>
          <span>Total</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-good"></div>
          <span>Good Content</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-disposal"></div>
          <span>Disposal</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
