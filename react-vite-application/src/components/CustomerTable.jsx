import React, {useState} from "react";
import "./styles/CustomerTable.css"

const CustomerTable = ({ tableData }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Calculate total pages
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  // Calculate data for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page change
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
            {currentItems.map((row, index) => (
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

  export default CustomerTable;