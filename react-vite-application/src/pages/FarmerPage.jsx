// File: src/pages/FarmerPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import FarmerLeftForm from "../components/FarmerLeftForm";
import FarmerRightForm from "../components/FarmerRightForm";
import "./FarmerPage.css";

function FarmerPage() {
  const [farmerData, setFarmerData] = useState({
    fullName: "",
    nicNumber: "",
    contactNumber: "",
    size: "",
    growingArea: "",
    category: "",
  });

  const [weightEntry, setWeightEntry] = useState({
    vehicleNo: "",
    grnNumber: "",
    crates: 0,
    date: new Date().toISOString().slice(0, 10),
    totalWeight: 0,
    unitPrice: 0,
    bucketWeights: [],
  });

  const [farmerId, setFarmerId] = useState("");
  const [bucketWeight, setBucketWeight] = useState("");

  const fetchFarmerDetails = (id) => {
    const sampleData = {
      1: { fullName: "John Doe", nicNumber: "123456789V", contactNumber: "0712345678", size: "Large", growingArea: "North", category: "A" },
      2: { fullName: "Jane Smith", nicNumber: "987654321V", contactNumber: "0718765432", size: "Medium", growingArea: "East", category: "B" },
    };
    return sampleData[id] || {};
  };

  const handleSearch = () => {
    const data = fetchFarmerDetails(farmerId);
    setFarmerData(data);
  };

  const handleWeightChange = (e) => {
    setBucketWeight(e.target.value);
  };

  const addWeight = () => {
    if (bucketWeight) {
      const newWeights = [...weightEntry.bucketWeights, parseFloat(bucketWeight)];
      const totalWeight = newWeights.reduce((acc, curr) => acc + curr, 0);
      setWeightEntry({
        ...weightEntry,
        bucketWeights: newWeights,
        totalWeight: totalWeight,
      });
      setBucketWeight("");
    }
  };

  const removeWeight = (index) => {
    const newWeights = weightEntry.bucketWeights.filter((_, i) => i !== index);
    const totalWeight = newWeights.reduce((acc, curr) => acc + curr, 0);
    setWeightEntry({
      ...weightEntry,
      bucketWeights: newWeights,
      totalWeight: totalWeight,
    });
  };

  return (
    <div className="farmer-page-container">
      <Header />
      {/* Search bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Scan Your QR code or Enter Farmer ID..."
          value={farmerId}
          onChange={(e) => setFarmerId(e.target.value)}
          className="search-bar"
        />
        <button onClick={handleSearch} className="select-button">Select</button>
      </div>

      {/* Forms Container */}
      <div className="forms-container">
        {/* Left side farmer details form */}
        <FarmerLeftForm farmerData={farmerData} />

        {/* Right side weight entry form */}
        <FarmerRightForm
          weightEntry={weightEntry}
          bucketWeight={bucketWeight}
          handleWeightChange={handleWeightChange}
          addWeight={addWeight}
          removeWeight={removeWeight}
          setWeightEntry={setWeightEntry}
        />
      </div>
    </div>
  );
}

export default FarmerPage;

