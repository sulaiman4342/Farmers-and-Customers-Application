import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import RegistrationPage from './pages/RegistrationPage';
import CustomerListPage from './pages/CustomerListPage';
import FarmerRegistrationPage from './pages/FarmersListPage'
import CustomerRegistrationForm from './components/CustomerRegistrationForm';
import FarmerRegistrationForm from './components/FarmerRegistration';
import Dashboard from './pages/DashboardPage';
import FarmerPage from './pages/FarmerPage';
import CustomerPage from './pages/CustomerPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/customer-list" element={<CustomerListPage />} />
          <Route path="/farmer-list" element={<FarmerRegistrationPage />} />
          <Route path="/customer-registration" element={<CustomerRegistrationForm />} />
          <Route path="/farmer-registration" element={<FarmerRegistrationForm />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/farmerPage" element={<FarmerPage />} />
          <Route path="/customerPage" element={<CustomerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
