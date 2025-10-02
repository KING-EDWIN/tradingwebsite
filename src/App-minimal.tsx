import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Minimal test component
const TestPage = () => (
  <div style={{ 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        🚀 TradeMaster Academy
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>
        Minimal Test - React Router Working!
      </p>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)'
      }}>
        <p>✅ React is working</p>
        <p>✅ Routing is working</p>
        <p>✅ Styling is working</p>
      </div>
    </div>
  </div>
);

const AppMinimal = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<TestPage />} />
      <Route path="/super-admin" element={<TestPage />} />
      <Route path="*" element={<TestPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppMinimal;



