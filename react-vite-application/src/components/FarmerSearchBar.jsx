// File: src/components/SearchBar.jsx
import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import "./styles/FarmerSearchBar.css";

const SearchBar = forwardRef(({ farmerId, setFarmerId, onSearch }, ref) => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Scan Your QR code or Enter Farmer ID..."
        value={farmerId}
        onChange={(e) => setFarmerId(e.target.value)}
        className="farmer-page-search-bar"
        ref={ref}
      />
      <button onClick={onSearch} className="farmer-select-button">Select</button>
    </div>
  );
});

SearchBar.propTypes = {
  farmerId: PropTypes.string.isRequired,
  setFarmerId: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
