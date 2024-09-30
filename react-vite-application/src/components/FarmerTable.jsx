// File: src/components/FarmerTable.jsx
import React from "react";
import "./styles/FarmerTable.css"; 
const FarmerTable = ({ tableData }) => {
  return (
    <div className="table-container">
      <table className="farmer-table">
        <thead>
          <tr>
            <th>Farmer Name</th>
            <th>Container Number</th>
            <th>GRN Number</th>
            <th>Date</th>
            <th>Total Weight</th>
            <th>Number of Crates</th>
            <th>Weight Disposal</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.farmerName}</td>
              <td>{row.containerNumber}</td>
              <td>{row.grnNumber}</td>
              <td>{row.date}</td>
              <td>{row.totalWeight}</td>
              <td>{row.numberOfCrates}</td>
              <td>{row.weightDisposal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FarmerTable;
