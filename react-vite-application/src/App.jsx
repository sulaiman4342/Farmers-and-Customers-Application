import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('userRole');
    setUsername(storedUsername || '');
    setIsLoggedIn(Boolean(storedUsername));
  }, []);

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/aboutUs" element={<AboutUs />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/adminUserview"
              element={isLoggedIn && username === 'Administrator' ? <AdminUserView /> : <Navigate to="/" />}
            />
            <Route
              path="/registration"
              element={isLoggedIn ? <RegistrationPage /> : <Navigate to="/" />}
            />
            <Route
              path="/customer-list"
              element={isLoggedIn ? <CustomerListPage /> : <Navigate to="/" />}
            />
            <Route
              path="/farmer-list"
              element={isLoggedIn ? <FarmerRegistrationPage /> : <Navigate to="/" />}
            />
            <Route
              path="/customer-registration"
              element={isLoggedIn ? <CustomerRegistrationForm /> : <Navigate to="/" />}
            />
            <Route
              path="/farmer-registration"
              element={isLoggedIn ? <FarmerRegistrationForm /> : <Navigate to="/" />}
            />
            <Route
              path="/daily-price"
              element={isLoggedIn ? <PriceAdd /> : <Navigate to="/" />}
            />
            <Route
              path="/farmerPage"
              element={isLoggedIn ? <FarmerPage /> : <Navigate to="/" />}
            />
            <Route
              path="/customerPage"
              element={isLoggedIn ? <CustomerPage /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
