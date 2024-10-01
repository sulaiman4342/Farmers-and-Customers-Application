// File: src/pages/FarmerPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FarmerLeftForm from "../components/FarmerLeftForm";
import FarmerRightForm from "../components/FarmerRightForm";
import FarmerTable from "../components/FarmerTable";
import SearchBar from "../components/FarmerSearchBar";
import "./FarmerPage.css";

function FarmerPage() {
  const [farmerData, setFarmerData] = useState({
    fullName: "",
    nicNumber: "",
    contactNumber: "",
    size: "",
    growingArea: "",
    category: ""
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

  const tableData = [
    { farmerName: "M.R. Sirisena", containerNumber: "hcdsgch", grnNumber: "hdg", date: "2024-08-05", totalWeight: 210.87, numberOfCrates: 5, weightDisposal: 8.25 },
    { farmerName: "M.K. Siripala", containerNumber: "123", grnNumber: "11", date: "2024-01-05", totalWeight: 157.00, numberOfCrates: 4, weightDisposal: 10.25 },
    { farmerName: "M.R. Sirisena", containerNumber: "1", grnNumber: "123", date: "2023-12-22", totalWeight: 110.44, numberOfCrates: 4, weightDisposal: 12.25 }
  ];

  return (
    <div className="farmer-page-container">
      <Header />

      {/* Search bar extracted as a separate component */}
      <SearchBar 
        farmerId={farmerId}
        setFarmerId={setFarmerId}
        onSearch={handleSearch}
      />

      {/* Forms Container */}
      <div className="forms-container">
        <FarmerLeftForm farmerData={farmerData} />
        <FarmerRightForm
          weightEntry={weightEntry}
          bucketWeight={bucketWeight}
          handleWeightChange={handleWeightChange}
          addWeight={addWeight}
          removeWeight={removeWeight}
          setWeightEntry={setWeightEntry}
        />
      </div>

      {/* Farmer Table */}
      <FarmerTable tableData={tableData} />

      <Footer />
    </div>
  );
}

export default FarmerPage;

