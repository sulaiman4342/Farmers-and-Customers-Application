// File: src/components/SearchBar.jsx
import React from "react";
import PropTypes from "prop-types";
import "./styles/FarmerSearchBar.css";

const SearchBar = ({ farmerId, setFarmerId, onSearch }) => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Scan Your QR code or Enter Farmer ID..."
        value={farmerId}
        onChange={(e) => setFarmerId(e.target.value)}
        className="farmer-page-search-bar"
      />
      <button onClick={onSearch} className="farmer-select-button">Select</button>
    </div>
  );
};

SearchBar.propTypes = {
  farmerId: PropTypes.string.isRequired,
  setFarmerId: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
