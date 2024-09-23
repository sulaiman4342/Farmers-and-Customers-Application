import React from "react";
import PropTypes from "prop-types";
import './styles/FarmerRightForm.css';

const FarmerRightForm = ({
  weightEntry,
  bucketWeight,
  handleWeightChange,
  addWeight,
  removeWeight,
  setWeightEntry
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
              onChange={(e) => setWeightEntry({ ...weightEntry, crates: e.target.value })}
            />
          </div>
          <div className="form-row">
            <input 
              type="text"
              value={weightEntry.date} readOnly />
          </div>
          <button className="submit-button">Submit</button>
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
              type="number"
              value={weightEntry.unitPrice}
              onChange={(e) => setWeightEntry({ ...weightEntry, unitPrice: e.target.value })}
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
  handleWeightChange: PropTypes.func.isRequired,
  addWeight: PropTypes.func.isRequired,
  removeWeight: PropTypes.func.isRequired,
  setWeightEntry: PropTypes.func.isRequired,
};

export default FarmerRightForm;
