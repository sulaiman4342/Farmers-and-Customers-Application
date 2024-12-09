// File: src/pages/CustomerPage.jsx
import  { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
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
    export: "",
    localNo1: "",
    localNo2: "",
    grade3: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [exportPrice, setExportPrice] = useState('');
  const [localNo1Price, setLocalNo1Price] = useState('');
  const [localNo2Price, setLocalNo2Price] = useState('');
  const [grade3Price, setGrade3Price] = useState('');

  const [tableData, setTableData] = useState([]);
  const [customerId, setCustomerId] = useState("");

  const user_id = parseInt(localStorage.getItem('user_id'), 10);

  const searchInputRef = useRef(null);

  useEffect(() =>{
    searchInputRef.current?.focus();
  }, []);

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
                console.log("error",error)
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

    // Check that essential fields are filled
    if(customerData.seller_id && saleEntry.export && saleEntry.localNo1 && saleEntry.localNo2 &&  saleEntry.grade3) {

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

        // Call handlePrint after successful submission
        handlePrint(payload);

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
    }  else {
        //If required fields are missing
        Swal.close();
        Swal.fire({
          title: 'Error!',
          text: 'Please ensure all required fields are filled and a customer is selected!',
          icon: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
  
    if (printWindow) {
      const formattedDate = saleEntry.date
        ? new Date(new Date(saleEntry.date).getTime() - new Date(saleEntry.date).getTimezoneOffset() * 60000)
            .toISOString()
            .substring(0, 10)
        : null;
  
      // Calculate the total cost using the existing calculateCost function
      const totalCost = calculateCost();
  
      // Build the bill content for printing
      const billContent = `
        <html>
        <head>
          <title>Print Customer Bill</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              font-size: 14px;
            }
            .bill-container {
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <div class="bill-container">
            <h2>Customer Bill</h2>
            <p><strong>Customer Name:</strong> ${customerData.fullName}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
  
            <table>
              <thead>
                <tr>
                  <th>Quality</th>
                  <th>Quantity (kg)</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Export</td>
                  <td>${saleEntry.export}</td>
                  <td>${exportPrice}</td>
                  <td>Rs: ${(parseFloat(saleEntry.export) * parseFloat(exportPrice)).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Local No 1</td>
                  <td>${saleEntry.localNo1}</td>
                  <td>${localNo1Price}</td>
                  <td>Rs: ${(parseFloat(saleEntry.localNo1) * parseFloat(localNo1Price)).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Local No 2</td>
                  <td>${saleEntry.localNo2}</td>
                  <td>${localNo2Price}</td>
                  <td>Rs: ${(parseFloat(saleEntry.localNo2) * parseFloat(localNo2Price)).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Grade 3</td>
                  <td>${saleEntry.grade3}</td>
                  <td>${grade3Price}</td>
                  <td>Rs: ${(parseFloat(saleEntry.grade3) * parseFloat(grade3Price)).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3"><strong>Total Cost</strong></td>
                  <td>Rs: ${totalCost}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
        </html>
      `;
  
      printWindow.document.write(billContent);
      printWindow.document.close();
      printWindow.print();
    } else {
      alert('Unable to open the print window. Please check your browser settings.');
    }
  };
  

  return (
    <div className="customer-page-container">
      <Header />
      <SearchBar
        value={customerId}
        setValue={setCustomerId}
        onSearch={handleCustomerSearch}
        placeholder="Scan Your QR code or Enter Customer ID..."
        className="customer-page-search-bar"
        ref = {searchInputRef}
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
