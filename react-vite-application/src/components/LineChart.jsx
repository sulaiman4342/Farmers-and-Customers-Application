// src/components/LineChart.jsx
import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const LineChart = ({ chartData }) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (!chartData || chartData.length === 0) {
      return; // Avoid initializing chart with no data
    }

    const ctx = canvasRef.current.getContext('2d');

    const labels = chartData.map((sale) => sale.customerName);
    const datasets = [
      {
        label: 'Total',
        data: chartData.map((sale) => sale.total),
        borderColor: 'blue',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Local No 1',
        data: chartData.map((sale) => sale.localNo1),
        borderColor: 'green',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Local No 2',
        data: chartData.map((sale) => sale.localNo2),
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
      },
      {
        label: 'Grade',
        data: chartData.map((sale) => sale.grade3),
        borderColor: 'red',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
      },
      {
        label: 'Export',
        data: chartData.map((sale) => sale.export),
        borderColor: 'purple',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ];

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {labels, datasets },
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

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData]);

  return <canvas ref={canvasRef}></canvas>;
};

export default LineChart;
