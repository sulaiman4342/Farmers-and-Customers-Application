// File: src/pages/CustomerPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import CustomerSearchBar from "../components/CustomerSearchBar";
import CustomerLeftForm from "../components/CustomerLeftForm";
import CustomerRightForm from "../components/CustomerRightForm";
import "./CustomerPage.css";
import CustomerTable from "../components/CustomerTable";

function CustomerPage() {
  const [customerData, setCustomerData] = useState({
    fullName: "",
    nicNumber: "",
    contactNumber: "",
  });

  const [saleEntry, setSaleEntry] = useState({
    export: "",
    localNo1: "",
    localNo2: "",
    grade3: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [customerId, setCustomerId] = useState("");

  const fetchCustomerDetails = (id) => {
    const customerSampleData = {
      1: { fullName: "Kamal Nishanth", nicNumber: "2000987765", contactNumber: "0913908744" },
      2: { fullName: "AD Sumanasiri", nicNumber: "20980984365", contactNumber: "0773657494" },
    };
    return customerSampleData[id] || {};
  };

  const handleCustomerSearch = () => {
    const data = fetchCustomerDetails(customerId);
    setCustomerData(data);
  };

  const customerTableData = [
    {customerName: "Kamal Nishanth",date: "2024-09-05",export: 10,localNo01: 6,localNo02: 12,grade03: 0,total: 30.00,cost: 11211.90},
    {customerName: "Kamal Nishanth",date: "2025-12-22",export: 10,localNo01: 10,localNo02: 10, grade03: 10,total: 40.00,cost: 1424750},
    {customerName: "AD Sumanasiri",date: "2023-12-22",export: 45,localNo01: 20,localNo02: 20,grade03: 10,total: 95.00,cost: 3424375}
];

  return (
    <div className="customer-page-container">
      <Header />
      <CustomerSearchBar
        customerId={customerId}
        setCustomerId={setCustomerId}
        handleCustomerSearch={handleCustomerSearch}
      />
      <div className="forms-container">
        <CustomerLeftForm customerData={customerData} />
        <CustomerRightForm saleEntry={saleEntry} setSaleEntry={setSaleEntry} />
      </div>

      <div className="table-container">
        <CustomerTable tableData={customerTableData} />      
      </div>
    </div>
  );
}

export default CustomerPage;
