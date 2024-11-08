// File: src/pages/CustomerPage.jsx
import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import CustomerSearchBar from "../components/CustomerSearchBar";
import CustomerLeftForm from "../components/CustomerLeftForm";
import CustomerRightForm from "../components/CustomerRightForm";
import "./CustomerPage.css";
import CustomerTable from "../components/CustomerTable";
import Swal from "sweetalert2";
import axios from "axios";

function CustomerPage() {
  const [customerData, setCustomerData] = useState({
    fullName: "",
    nicNumber: "",
    contactNumber: "",
    seller_id:""
  });

  const [saleEntry, setSaleEntry] = useState({
    export: 0,
    localNo1: 0,
    localNo2: 0,
    grade3: 0,
    date: new Date().toISOString().slice(0, 10),
  });

  const [exportPrice, setExportPrice] = useState('');
  const [localNo1Price, setLocalNo1Price] = useState('');
  const [localNo2Price, setLocalNo2Price] = useState('');
  const [grade3Price, setGrade3Price] = useState('');

  const [tableData, setTableData] = useState([]);
  const [customerId, setCustomerId] = useState("");

  const user_id = parseInt(localStorage.getItem('user_id'), 10);

  // Function to fetch customer details from the backend based on customerId
  const fetchCustomerDetails = async (customerId) => {
    const apiUrl = `http://64.227.152.179:8080/weighingSystem-1/seller/showId/${customerId}`;

    // Show loading alert
    Swal.fire({
        title: 'Searching...',
        html: '<div class="modern-loading"><div class="spinner"></div><div>Loading...</div></div>',
        showConfirmButton: false,
        allowOutsideClick: false,
    });

    try {
        // Check if customerId is a string and try to parse as JSON
        if (isNaN(customerId)) {
            try {
                const parsedData = JSON.parse(customerId);

                // Verify if parsed JSON contains user_id matching current user
                if (parsedData.user_id === user_id) {
                    setCustomerData({
                        fullName: `${parsedData.firstname} ${parsedData.lastname}`,
                        nicNumber: parsedData.idnumber,
                        contactNumber: parsedData.connumber,
                        seller_id: parsedData.id,
                    });

                    Swal.close();
                    Swal.fire({
                        title: 'Success!',
                        text: 'Customer data fetched successfully!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                    });
                } else {
                    throw new Error("No Customer Found!");
                }
            } catch (error) {
                // Handle JSON parsing errors or unmatched IDs
                Swal.close();
                Swal.fire({
                    title: 'Error!',
                    text: 'Invalid JSON format or No Customer Found!',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
            }
        } 
        // If customerId is numeric, make API call
        else if (!isNaN(customerId)) {
            const response = await axios.get(apiUrl);
            const data = response.data;

            // Verify if user_id matches
            if (data.user_id === user_id) {
                setCustomerData({
                    fullName: `${data.firstname} ${data.lastname}`,
                    nicNumber: data.idnumber,
                    contactNumber: data.connumber,
                    seller_id: data.id,
                });

                Swal.close();
                Swal.fire({
                    title: 'Success!',
                    text: 'Customer data fetched successfully!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
            } else {
                throw new Error("No Customer Found!");
            }
        } 
        // If neither string nor numeric, show error
        else {
            throw new Error("Invalid format for customer ID.");
        }
    } catch (error) {
        // Close loading alert and show error
        Swal.close();
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Error loading customer data from the server.',
            icon: 'error',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        });
    }
  };

  // Handler to call fetchCustomerDetails when searching for a customer
  const handleCustomerSearch = () => {
    if (customerId) {
        fetchCustomerDetails(customerId);
    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Please enter a Customer ID to search!',
            icon: 'error',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        });
    }
  };

  // Handler to submit sale entry data
  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: null,
      html: '<div class="modern-loading"><div class="spinner"></div><div>Submitting...</div></div>',
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    // Construct the payload based on form data
    const payload = {
      sellername: customerData.fullName,
      export: parseFloat(saleEntry.export),
      local_no_1: parseFloat(saleEntry.localNo1),
      local_no_2: parseFloat(saleEntry.localNo2),
      grade3: parseFloat(saleEntry.grade3),
      date: saleEntry.date,
      seller_id: customerData.seller_id,
      cost: calculateCost(),
      total: calculateTotal()
    };

    try {
      axios.post(
        "http://64.227.152.179:8080/weighingSystem-1/stocksell/save",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      
      Swal.close();
      Swal.fire({
        title: 'Success!',
        text: 'Sale entry submitted successfully!',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      // Update the table data to include the new sale entry
      setTableData((prevTableData) => [
        ...prevTableData,
        {
          customerName: payload.sellername,
          date: payload.date,
          export: payload.export,
          localNo01: payload.local_no_1,
          localNo02: payload.local_no_2,
          grade03: payload.grade3,
          total: payload.total,
          cost: payload.cost,
        },
      ]);

      // Reset sale entry form data
      setSaleEntry({
        export: "",
        localNo1: "",
        localNo2: "",
        grade3: "",
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (error) {
      Swal.close();
      console.error('Error submitting sale entry:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error submitting sale entry to the server.',
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    }
  };

  // Fetch all customer sale entries for the table
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get("http://64.227.152.179:8080/weighingSystem-1/stocksell/all");
        
        // Filter the data to include only records for the current user
        const filteredData = response.data.filter((item) => item.seller.users.id === user_id);
        
        // Map and format data as needed for CustomerTable
        const formattedData = filteredData.map((item) => ({
          customerName: item.sellername,
          date: item.date,
          export: parseFloat(item.export),
          localNo01: parseFloat(item.local_no_1),
          localNo02: parseFloat(item.local_no_2),
          grade03: parseFloat(item.grade3),
          total: parseFloat(item.total),
          cost: parseFloat(item.cost)
        }));
        
        setTableData(formattedData.reverse()); // Reverse for most recent entries first
      } catch (error) {
        console.error("Error fetching table data:", error);
        Swal.fire({
          title: "Error!",
          text: "Error loading table data from the server.",
          icon: "error",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    };

    const fetchPriceData = async () => {
      try {
        const defaultDate = new Date();
        const formattedDefaultDate = new Date(
          defaultDate.getTime()-defaultDate.getTimezoneOffset() * 60000)
          .toISOString()
          .substring(0,10);

        const priceResponse = await axios.get(`http://64.227.152.179:8080/weighingSystem-1/price/${formattedDefaultDate}`);

        const filteredPriceData = priceResponse.data.filter(data => data.user_id===user_id);

        if (filteredPriceData.length > 0){
          const firstPriceData = filteredPriceData[0];
          setExportPrice(firstPriceData.exportsell);
          setLocalNo1Price(firstPriceData.local_no_1sell);
          setLocalNo2Price(firstPriceData.local_no_2sell);
          setGrade3Price(firstPriceData.grade3sell);
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'No price data found for the user.',
            icon: 'error',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
          });
        }
      } catch (priceError) {
        console.error('Error fetching price data:', priceError);
        Swal.fire({
          title: 'Error!',
          text: 'Error loading price data from the server.',
          icon: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    };
    
    fetchTableData();
    fetchPriceData();
  }, [user_id]);

  const calculateTotal = () => {
    const exportWeight = parseFloat(saleEntry.export);
    const localNo1Weight = parseFloat(saleEntry.localNo1);
    const localNo2Weight = parseFloat(saleEntry.localNo2);
    const grade3Weight = parseFloat(saleEntry.grade3);

    const total = exportWeight + localNo1Weight + localNo2Weight + grade3Weight;

    return isNaN(total) ? 0 : `${total.toFixed(2)}`;
  };

  const calculateCost = () => {
    const costExport = parseFloat(saleEntry.export) * parseFloat(exportPrice);
    const costLocalNo1 = parseFloat(saleEntry.localNo1) * parseFloat(localNo1Price);
    const costLocalNo2 = parseFloat(saleEntry.localNo2) * parseFloat(localNo2Price);
    const costGrade3 = parseFloat(saleEntry.grade3) * parseFloat(grade3Price);

    const totalCost = costExport + costLocalNo1 + costLocalNo2 + costGrade3;

    return isNaN(totalCost) ? 0 : `${totalCost.toFixed(2)}`;
  }

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
        <CustomerRightForm saleEntry={saleEntry} setSaleEntry={setSaleEntry} handleSubmit={handleSubmit} />
      </div>

      <div className="table-container">
        <CustomerTable tableData={tableData} />      
      </div>
    </div>
  );
}

export default CustomerPage;
