import React from 'react';
import './styles/DataTable.css';

const DataTable = ({ selectedFarmer, data }) => {
  if (!selectedFarmer) {
    return <div className="no-selection">Please select a farmer to view the data.</div>;
  }

  const farmerData = data.filter((row) => row.farmer === selectedFarmer.name);

  return (
    <div className="data-table">
      <h3>{selectedFarmer.name}'s Data</h3>
      <table>
        <thead>
          <tr>
            <th>Container Number</th>
            <th>Date</th>
            <th>No of Boxes</th>
            <th>Total</th>
            <th>Good Content</th>
            <th>Disposal</th>
          </tr>
        </thead>
        <tbody>
          {farmerData.map((row, index) => (
            <tr key={index}>
              <td>{row.containerNumber}</td>
              <td>{row.date}</td>
              <td>{row.noOfBoxes}</td>
              <td>{row.total}</td>
              <td>{row.goodContent}</td>
              <td>{row.disposal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
