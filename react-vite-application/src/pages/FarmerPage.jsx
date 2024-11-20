// File: src/pages/FarmerPage.jsx
import React, { useState, useEffect, useRef  } from "react";
import Header from "../components/Header";
import FarmerLeftForm from "../components/FarmerLeftForm";
import FarmerRightForm from "../components/FarmerRightForm";
import FarmerTable from "../components/FarmerTable";
import SearchBar from "../components/FarmerSearchBar";
import Swal from "sweetalert2";
import axios from "axios";
import "./FarmerPage.css";

function FarmerPage() {

  const user_id = parseInt(localStorage.getItem('user_id'), 10);

  const [farmerData, setFarmerData] = useState({
    fullName: "",
    nicNumber: "",
    contactNumber: "",
    size: "",
    growingArea: "",
    category: "",
    supplier_id: null
  });

  const [weightEntry, setWeightEntry] = useState({
    vehicleNo: "",
    grnNumber: "",
    crates: "",
    date: new Date().toISOString().slice(0, 10),
    totalWeight: 0,
    bucketWeights: [],
  });

  const [tableData, setTableData] = useState([]);
  const [unitPrice, setUnitPrice] = useState(0); // State for unit price
  const [farmerId, setFarmerId] = useState("");
  const [bucketWeight, setBucketWeight] = useState("");

  const [isComPortConnected, setIsComPortConnected] = useState(window.serialPort?.isConnected || false);

  const searchInputRef = useRef(null);

  // useEffect(() => {
  //   if (!isComPortConnected) {
  //     connectComPort();
  //   }
  // },[isComPortConnected]);

  // Connect COM Port
  const connectComPort = async () => {
    try {
      if (window.serialPort?.port) {
        Swal.fire("Info", "COM Port is already connected.", "info");
        setIsComPortConnected(true);
        return;
      }

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      window.serialPort = { port, isConnected: true };
      setIsComPortConnected(true);
      localStorage.setItem("isComPortConnected", true);
      listenToComPort(port);
      Swal.fire("Success", "COM Port connected successfully!", "success");
    } catch (error) {
      console.error("Error connecting to COM port:", error);
      Swal.fire("Error", "Failed to connect to COM port. Please try again.", "error");
    }
  };

  const bucketWeightRef = useRef("");

  // Disconnect COM Port on Page Unload
  const disconnectComPort = async () => {
    if (window.serialPort?.port) {
      try {
        await window.serialPort.port.close();
        window.serialPort = { port: null, isConnected: false };
        setIsComPortConnected(false);
        localStorage.setItem("isComPortConnected", false);
        console.log("COM port closed successfully.");
      } catch (error) {
        console.warn("Error closing the COM port:", error);
      }
    }
  };

  const listenToComPort = async (port) => {
    const textDecoder = new TextDecoderStream();
    await port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
  
    try {
      while (true) {
        // Read data from the COM port
        const { value, done } = await reader.read();
        if (done) break;
  
        if (value) {
          // Trim and process the received data
          const trimmedValue = value.trim();
          if (bucketWeightRef.current !== trimmedValue) {
            bucketWeightRef.current = trimmedValue;
            setBucketWeight(trimmedValue);
          }
        }
      }
    } catch (error) {
      console.error("Error reading from COM port:", error);
  
      // Disconnect if an error occurs while reading data
      disconnectComPort();
      Swal.fire("Error", "COM port disconnected due to an error.", "error");
    } finally {
      // Release the lock on the reader
      reader.releaseLock();
    }
  };
  
  const portRef = useRef(null);

  useEffect(() => {
    const handleUnload = () => {
      disconnectComPort();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

    // Add Weight Handler
    const addWeight = () => {
      if (!isComPortConnected) {
        Swal.fire("Error", "Please connect to the COM port before adding weight.", "error");
        return;
      }
  
      if (bucketWeight) {
        const newWeights = [...weightEntry.bucketWeights, parseFloat(bucketWeight)];
        setWeightEntry({
          ...weightEntry,
          bucketWeights: newWeights,
          totalWeight: newWeights.reduce((acc, w) => acc + w, 0),
        });
        setBucketWeight("");
        bucketWeightRef.current = "";
      }
    };

  // Fetch all data for the table
  useEffect(() => {
    // Focus on search input when component mounts
    searchInputRef.current?.focus();

    // Fetch all data and filter by user_id
    axios
      .get("http://64.227.152.179:8080/weighingSystem-1/data/all")
      .then((response) => {
        const filteredData = response.data.filter(
          (item) => item.supplier.users.id === user_id
        );
        setTableData(filteredData.reverse().map((item) =>({
          ...item,
          total: Number(item.total),
          noofbox: Number(item.noofbox),
        }))
      );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        Swal.fire({
          title: "Error!",
          text: "Error loading data from the server.",
          icon: "error",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      });

    // Fetch price data based on the selected date
    const defaultDate = new Date();
    const formattedDate = new Date(
      defaultDate.getTime() - defaultDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .substring(0, 10);

    axios
      .get(`http://64.227.152.179:8080/weighingSystem-1/price/${formattedDate}`)
      .then((priceResponse) => {
        const filteredPriceData = priceResponse.data.filter(
          (data) => data.user_id === user_id
        );

        if (filteredPriceData.length > 0) {
          setUnitPrice(filteredPriceData[0].bulkbuy || 0); // Set unit price from the first matching entry
        } else {
          Swal.fire({
            title: "Error!",
            text: "No price data found for the user on this date.",
            icon: "warning",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      })
      .catch((priceError) => {
        console.error("Error fetching price data:", priceError);
        Swal.fire({
          title: "Error!",
          text: "Error loading price data from the server.",
          icon: "error",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      });
  }, [user_id]);

  // Fetch farmer details based on farmerId (showId)
  const fetchFarmerData = async () => {
    // Show loading alert
    Swal.fire({
        title: 'Searching...',
        html: '<div class="modern-loading"><div class="spinner"></div><div>Loading...</div></div>',
        showConfirmButton: false,
        allowOutsideClick: false,
    });

    try {
        // Check if farmerId is a string (not numeric) and attempt to parse as JSON
        if (isNaN(farmerId)) {
            try {
                const parsedData = JSON.parse(farmerId);
                
                // Check if parsed JSON contains user_id matching current user
                if (parsedData.user_id === user_id) {
                    setFarmerData({
                        fullName: `${parsedData.firstname} ${parsedData.lastname}`,
                        nicNumber: parsedData.idnumber,
                        contactNumber: parsedData.connumber,
                        size: parsedData.size,
                        growingArea: parsedData.area,
                        category: parsedData.category,
                        supplier_id: parsedData.id,
                    });
                    Swal.close();
                    Swal.fire({
                        title: 'Success!',
                        text: 'Successfully fetched data',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                    });
                } else {
                    throw new Error("No Farmer Found!");
                }
            } catch (error) {
                Swal.close();
                Swal.fire({
                    title: 'Error!',
                    text: 'Invalid JSON format or No Farmer Found!',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
            }
        } 
        // Check if farmerId is a number
        else if (!isNaN(farmerId)) {
            const apiUrl = `http://64.227.152.179:8080/weighingSystem-1/supplier/showId/${farmerId}`;
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (data.user_id === user_id) {
                setFarmerData({
                    fullName: `${data.firstname} ${data.lastname}`,
                    nicNumber: data.idnumber,
                    contactNumber: data.connumber,
                    size: data.size,
                    growingArea: data.area,
                    category: data.category,
                    supplier_id: data.id,
                });

                Swal.close();
                Swal.fire({
                    title: 'Success!',
                    text: 'Successfully fetched data',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
            } else {
                throw new Error("No Farmer Found!");
            }
        } 
        // If neither string nor numeric, show error
        else {
            throw new Error("Invalid format for farmer ID.");
        }
    } catch (error) {
        Swal.close();
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Error loading farmer data',
            icon: 'error',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: null,
      html: '<div class="modern-loading"><div class="spinner"></div><div>Loading...</div></div>',
      showConfirmButton: false,
      allowOutsideClick: false,
    });
  
    // Format the date
    const formattedDate = weightEntry.date 
      ? new Date(new Date(weightEntry.date).getTime() - new Date(weightEntry.date).getTimezoneOffset() * 60000)
          .toISOString()
          .substring(0, 10)
      : null;
        
    // Check that essential fields are filled
    if (farmerData.fullName && weightEntry.grnNumber && weightEntry.crates && weightEntry.totalWeight) {
      // Create the weights array
      const weightsArray = weightEntry.bucketWeights.map((weight) => ({ weight }));
  
      // Construct the payload for the API request
      const payload = {
        containerNumber: weightEntry.vehicleNo,
        grnnumber: weightEntry.grnNumber,
        noofbox: weightEntry.crates,
        trays: weightsArray.length, // Set trays based on bucket count
        date: formattedDate,
        supplier_id: farmerData.supplier_id, 
        area: farmerData.growingArea,
        size: farmerData.size,
        category: farmerData.category,
        total: weightEntry.totalWeight,
        weights: weightsArray,
        unitprice: unitPrice,
        cost: weightEntry.totalWeight * unitPrice, // Calculate cost as total weight * unit price
      };      
  
      try {
        const response = await axios.post(
          'http://64.227.152.179:8080/weighingSystem-1/data/save',
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
  
        // Close loading alert and show success notification
        Swal.close();
        Swal.fire({
          title: 'Success!',
          text: 'Data submitted successfully!',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
  
        setTableData((prevTableData) => [
          ...prevTableData,
          {
            farmerName: farmerData.fullName,
            containerNumber: response.data.containerNumber,
            grnNumber: response.data.grnnumber,
            date: response.data.date,
            totalWeight: response.data.total,
            crates: response.data.noofbox,
            weightDisposal: response.data.disposal || 0, // Handle if disposal is null
          },
        ]);
        
        // Reset form data
        setFarmerData({
          fullName: "",
          nicNumber: "",
          contactNumber: "",
          size: "",
          growingArea: "",
          category: "",
          supplier_id: null, // Reset supplier_id
        });
        setWeightEntry({
          vehicleNo: "",
          grnNumber: "",
          crates: 0,
          date: new Date().toISOString().slice(0, 10),
          totalWeight: 0,
          bucketWeights: [],
        });
        setBucketWeight("");
        setFarmerId("");

        // Call handlePrint after successful submission
        handlePrint(payload);
        

      } catch (error) {
        Swal.close();
        console.error('Error submitting data:', error);
  
        // Show error alert
        Swal.fire({
          title: 'Error!',
          text: 'Error submitting data to the server.',
          icon: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    } else {
      // If required fields are missing
      Swal.close();
      Swal.fire({
        title: 'Error!',
        text: 'Please ensure all required fields are filled and a supplier is selected!',
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const handlePrint = (payload) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const billContent = `
        <html>
          <head>
            <title>Print Bill</title>
            <style>
              body { font-family: Arial, sans-serif; font-size: 14px; }
              .bill-container { margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="bill-container">
              <h2>Bill</h2>
              <p><strong>Farmer Name:</strong> ${farmerData.fullName}</p>
              <p><strong>Total Weight:</strong> ${payload.total} kg</p>
              <p><strong>Unit Price:</strong> ${unitPrice} per kg</p>
              <p><strong>Date:</strong> ${payload.date}</p><br>
              <table>
                <thead>
                  <tr><th>Grade</th><th>Item</th><th>Qty(kg)</th><th>Unit Price</th><th>Amount</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#</td>
                    <td>${farmerData.category}</td>
                    <td>${payload.total}</td>
                    <td>${unitPrice}</td>
                    <td>Rs: ${payload.total * unitPrice}</td>
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
    <div className="farmer-page-container">
      <Header />

      {/* Search bar extracted as a separate component */}
      <SearchBar 
        farmerId={farmerId}
        setFarmerId={setFarmerId}
        onSearch={fetchFarmerData}
      />

      {/* Connect Button - Visible only when not connected */}
      {!isComPortConnected && (
        <button onClick={connectComPort} className="connect-button">
          Connect COM Port
        </button>
      )}

      {/* Forms Container */}
      <div className="forms-container">
        <FarmerLeftForm farmerData={farmerData} />
        <FarmerRightForm
          weightEntry={weightEntry}
          bucketWeight={bucketWeight}
          handleWeightChange={(e) => setBucketWeight(e.target.value)}
          addWeight={addWeight}
          removeWeight={(index) => {
            const newWeights = weightEntry.bucketWeights.filter((_, i) => i !== index);
            setWeightEntry({ ...weightEntry, bucketWeights: newWeights, totalWeight: newWeights.reduce((acc, w) => acc + w, 0) });
          }}
          setWeightEntry={setWeightEntry}
          handleSubmit={handleSubmit}
          isComPortConnected={isComPortConnected}
        />
      </div>

      {/* Farmer Table */}
      <FarmerTable tableData={tableData} setTableData={setTableData}/>
    </div>
  );
}

export default FarmerPage;

