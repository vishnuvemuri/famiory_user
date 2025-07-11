import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VendorPage from './pages/VendorPage';
import { StoreProvider } from './context/StoreContext';
import './styles/globals.css';

function App() {
  return (
    <StoreProvider>
      <Router>
        <div className="min-h-screen bg-off-white">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/vendor/:vendorId" element={<VendorPage />} />
          </Routes>
        </div>
      </Router>
    </StoreProvider>
  );
}

export default App;