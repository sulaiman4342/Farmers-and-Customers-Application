import React from "react";
import PropTypes from "prop-types";
import './styles/FarmerRightForm.css';

const FarmerRightForm = ({
  weightEntry,
  bucketWeight,
  unitPrice,
  handleWeightChange,
  addWeight,
  removeWeight,
  setWeightEntry,
  handleSubmit,
  isComPortConnected
}) => {
  return (
    <div className="right-form-container">

      {/* Weight input row */}
      <div className="form-weight-section">
        <input
          type="text"
          placeholder="Enter Weight..."
          value={bucketWeight}
          onChange={handleWeightChange}
          disabled={!isComPortConnected}
          // readOnly= {isComPortConnected}
        />
        <button onClick={addWeight} className="add-button">+ ADD</button>
      </div>

      {/* Display added weights as cards */}
      <div className="weight-list">
        {weightEntry.bucketWeights.map((weight, index) => (
          <div key={index} className="weight-card">
            <span>{weight} kg</span>
            <button onClick={() => removeWeight(index)} className="delete-button">🗑</button>
          </div>
        ))}
      </div>

      {/* Left and Right Subsections */}
      <div className="form-bottom-row">
        {/* Left side input fields */}
        <div className="left-section">
          <div className="form-row">
            <input
              type="text"
              placeholder="Vehicle No."
              value={weightEntry.vehicleNo}
              onChange={(e) => setWeightEntry({ ...weightEntry, vehicleNo: e.target.value })}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="GRN No."
              value={weightEntry.grnNumber}
              onChange={(e) => setWeightEntry({ ...weightEntry, grnNumber: e.target.value })}
            />
          </div>
          <div className="form-row">
            <input
              type="number"
              placeholder="Crates"
              value={weightEntry.crates}
              onChange={(e) => setWeightEntry({ 
                ...weightEntry, 
                crates: Number(e.target.value) })}
            />
          </div>
          <div className="form-row">
            <input 
              type="date"
              value={weightEntry.date} 
              onChange={(e) => setWeightEntry({ ...weightEntry, date: e.target.value })}
              />
          </div>
          <button onClick={handleSubmit} className="submit-button">Submit</button>
        </div>

        {/* Right side input fields */}
        <div className="right-section">
          <div className="form-row">
            <label>Total Weight:</label>
            <input type="text" value={weightEntry.totalWeight} readOnly />
          </div>
          <div className="form-row">
            <label>Unit Price:</label>
            <input
              type="text"
              value={unitPrice}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

FarmerRightForm.propTypes = {
  weightEntry: PropTypes.shape({
    vehicleNo: PropTypes.string,
    grnNumber: PropTypes.string,
    crates: PropTypes.number,
    date: PropTypes.string,
    totalWeight: PropTypes.number,
    unitPrice: PropTypes.number,
    bucketWeights: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  bucketWeight: PropTypes.string.isRequired,
  unitPrice: PropTypes.number.isRequired,
  handleWeightChange: PropTypes.func.isRequired,
  addWeight: PropTypes.func.isRequired,
  removeWeight: PropTypes.func.isRequired,
  setWeightEntry: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isComPortConnected: PropTypes.bool.isRequired
};

export default FarmerRightForm;
