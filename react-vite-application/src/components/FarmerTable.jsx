// File: src/components/FarmerTable.jsx
import React, { useState } from "react";
import "./styles/FarmerTable.css";
import PropTypes from "prop-types";

const FarmerTable = ({ tableData }) => {

  // State for current page and items per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

   // Calculate total pages
   const totalPages = Math.ceil(tableData.length / itemsPerPage);

   // Get the data to display on the current page
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  
  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
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
          {currentItems.map((row, index) => (
            <tr key={index}>
              <td>{`${row.supplier.firstname} ${row.supplier.lastname}`}</td>
              <td>{row.containerNumber}</td>
              <td>{row.grnnumber}</td>
              <td>{row.date}</td>
              <td>{row.total}</td>
              <td>{row.noofbox}</td>
              <td>{row.disposal || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          &laquo; 
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
           &raquo;
        </button>
      </div>
    </div>
  );
};

FarmerTable.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      supplier: PropTypes.shape({
        firstname: PropTypes.string.isRequired,
        lastname: PropTypes.string.isRequired,
      }).isRequired,
      containerNumber: PropTypes.string.isRequired,
      grnnumber: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      noofbox: PropTypes.number.isRequired,
      disposal: PropTypes.number,
    })
  ).isRequired,
};

export default FarmerTable;
