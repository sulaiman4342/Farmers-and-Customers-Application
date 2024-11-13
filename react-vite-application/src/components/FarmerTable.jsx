// File: src/components/FarmerTable.jsx
import React, { useState } from "react";
import "./styles/FarmerTable.css";
import Swal from "sweetalert2";
import axios from "axios";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const FarmerTable = ({ tableData, setTableData }) => {

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

  const handleUpdate = (stock_id, total) => {
    Swal.fire ({
      title: 'Weight Disposal',
      input: 'text',
      inputPlaceHolder: 'Enter disposal weight...',
      showCancelButton: true,
      confirmButtonText: 'Update',
      showLoaderOnConfirm: true,
      preConfirm: (data) => {
        const disposal = parseFloat(data);
        // Check if disposal is valid
        if (isNaN(disposal) || disposal < 0) {
          Swal.showValidationMessage("Please enter a valid positive number for disposal.");
          return;
        }

        // Ensure disposal is less than or equal to total
        if (disposal > total) {
          Swal.showValidationMessage(`Disposal cannot exceed the total (${total}).`);
          return;
        }

        const goodcontent = total - disposal;

        return axios
          .put(`http://64.227.152.179:8080/weighingSystem-1/data/${stock_id}`, { disposal, goodcontent })
          .then((response) => {
            console.log("API response:", response);

            if (response && response.data) {
              setTableData((prevTableData) => 
                prevTableData.map((item) => 
                  item.stock_id === stock_id ? { ...item, ...response.data } : item
                )
              );

              Swal.fire({
                title: 'Success!',
                text: 'Successfully updated disposal record!',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
            } else {
              throw new Error("Unexpected response structure");
            }
          })
          .catch((error) => {
            console.error('Update Error', error);
            Swal.fire({
              title: 'Error!',
              text: 'Error updating disposal data!',
              icon: 'error',
            });
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
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
              <td>
                {row.disposal ? (
                  row.disposal
                ) : (
                  <button onClick={() => handleUpdate(row.stock_id, row.total)} className="update-disposal-btn">
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                )}
              </td>
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
}

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
