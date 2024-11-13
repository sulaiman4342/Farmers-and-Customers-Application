import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import CustomerListPage from './pages/CustomerListPage';
import FarmerRegistrationPage from './pages/FarmersListPage';
import CustomerRegistrationForm from './pages/CustomerRegistrationForm';
import FarmerRegistrationForm from './pages/FarmerRegistration';
import PriceAdd from './pages/DailyPrice';
import Dashboard from './pages/DashboardPage';
import FarmerPage from './pages/FarmerPage';
import CustomerPage from './pages/CustomerPage';
import Footer from './components/Footer';
import AboutUs from './pages/AboutUs';
import AdminUserView from './pages/AdminUserView';

function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/customer-list" element={<CustomerListPage />} />
            <Route path="/farmer-list" element={<FarmerRegistrationPage />} />
            <Route path="/customer-registration" element={<CustomerRegistrationForm />} />
            <Route path="/farmer-registration" element={<FarmerRegistrationForm />} />
            <Route path="/daily-price" element={< PriceAdd />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/farmerPage" element={<FarmerPage />} />
            <Route path="/customerPage" element={<CustomerPage />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/adminUserview" element={<AdminUserView />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
