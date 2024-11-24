// src/components/LineChart.js
import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const LineChart = ({ chartData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('sales-line-chart').getContext('2d');

    const lineChartInstance = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true, // Adjust chart based on screen size
        maintainAspectRatio: false, // Allow better scaling for line chart
        scales: {
          y: {  // Change yAxes to y
            beginAtZero: true,  // Ensure the y-axis starts at zero
            max: 1000, // Adjust the max value of the Y-axis (customize based on your data)
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
      },
    });

    chartRef.current = lineChartInstance;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  return <canvas id="sales-line-chart"></canvas>;
};

export default LineChart;
