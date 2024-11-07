// File: src/components/CustomerRightForm.jsx
import React from 'react';
import "./styles/CustomerRightForm.css"; 

const CustomerRightForm = ({ saleEntry, setSaleEntry, handleSubmit }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaleEntry((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="customer-page-right-form-container">
      <form className="right-form" onSubmit={handleSubmit}>
        <div className="customer-page-form-group">
          <label>Export:</label>
          <input type="number" name="export" value={saleEntry.export} onChange={handleChange}  />
        </div>
        <div className="customer-page-form-group">
          <label>Local No 01:</label>
          <input type="number" name="localNo1" value={saleEntry.localNo1} onChange={handleChange} />
        </div>
        <div className="customer-page-form-group">
          <label>Local No 02:</label>
          <input type="number" name="localNo2" value={saleEntry.localNo2} onChange={handleChange} />
        </div>
        <div className="customer-page-form-group">
          <label>Grade 3:</label>
          <input type="number" name="grade3" value={saleEntry.grade3} onChange={handleChange} />
        </div>
        <div className="customer-page-form-group">
          
          <input 
            type="date" 
            name="date" 
            value={saleEntry.date} 
            onChange={handleChange}
            // readOnly // Date is readonly, cannot be changed
          />
        </div>

        {/* Submit Button */}
        <div className="customer-page-form-group">
          <button type="submit" className="submit-button">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CustomerRightForm;
