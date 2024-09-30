import React from "react";
import "./styles/CustomerTable.css"

const CustomerTable = ({ tableData }) => {
    return (
      <div className="table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Export</th>
              <th>Local No 01</th>
              <th>Local No 02</th>
              <th>Grade 03</th>
              <th>Total</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.customerName}</td>
                <td>{row.date}</td>
                <td>{row.export}</td>
                <td>{row.localNo01}</td>
                <td>{row.localNo02}</td>
                <td>{row.grade03}</td>
                <td>{row.total}</td>
                <td>{row.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default CustomerTable;