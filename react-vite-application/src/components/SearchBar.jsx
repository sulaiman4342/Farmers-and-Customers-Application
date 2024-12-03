// File: src/components/SearchBar.jsx
import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import './styles/SearchBar.css';

const SearchBar = forwardRef(({ value, setValue, onSearch, placeholder, className }, ref) => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={className}
        ref={ref}
      />
      <button onClick={onSearch} className="select-button">Select</button>
    </div>
  );
});

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

export default SearchBar;
