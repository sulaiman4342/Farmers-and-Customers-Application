// src/components/BarChart.js
import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const BarChart = ({ chartData}) =>{
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
          chartRef.current.destroy();
        }
    
        const ctx = document.getElementById('main-chart').getContext('2d');
        
        const chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: chartData.map((farmer) => farmer.farmerName),
            datasets: [
              { 
                label: 'Total', 
                data: chartData.map((farmer) => farmer.total), 
                backgroundColor: 'lightblue' 
              },
              { 
                label: 'Good Content', 
                data: chartData.map((farmer) => farmer.goodContent), 
                backgroundColor: 'lightgreen' 
              },    
              { 
                label: 'Disposal', 
                data: chartData.map((farmer) => farmer.disposal), 
                backgroundColor: 'red' 
              },
            ],
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
                    const farmer = chartData[index];
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
              },
            },
          },
        });
    
        chartRef.current = chartInstance;

        return() =>{
            // Cleanup on component unmount
            if(chartRef.current){
                chartRef.current.destroy();
            }
        };
      }, [chartData]);

      return <canvas id="main-chart"></canvas>
};

export default BarChart;