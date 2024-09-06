import React from 'react';
import './styles/ToggleTableButton.css';

const ToggleTableButton = ({ onToggle, showTable }) => {
  return (
    <div className="toggle-button-container">
      <button onClick={onToggle} className="toggle-button">
        {showTable ? 'Hide Data Table' : 'Show Data Table'}
      </button>
    </div>
  );
};

export default ToggleTableButton;
