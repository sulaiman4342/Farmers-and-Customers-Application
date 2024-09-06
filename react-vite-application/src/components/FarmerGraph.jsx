import React from 'react';
import './styles/FarmerGraph.css';
import { Bar } from 'react-chartjs-2';

const FarmerGraph = ({ selectedFarmer, data }) => {
  if (!selectedFarmer) {
    return <div className="no-graph">Please select a farmer to view the graph.</div>;
  }

  const farmerData = data.find((farmer) => farmer.name === selectedFarmer.name);

  const chartData = {
    labels: ['Total', 'Good Content', 'Disposal'],
    datasets: [
      {
        label: `${selectedFarmer.name} Stats`,
        backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f'],
        data: [farmerData.total, farmerData.goodContent, farmerData.disposal],
      },
    ],
  };

  return (
    <div className="farmer-graph">
      <Bar data={chartData} />
    </div>
  );
};

export default FarmerGraph;
