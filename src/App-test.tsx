import React from 'react';

const AppTest = () => {
  return (
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
          Trading Platform Loading...
        </p>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid #fff',
          borderTop: '5px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ marginTop: '20px', fontSize: '1rem', opacity: 0.8 }}>
          If you see this, React is working! The main app should load shortly...
        </p>
      </div>
    </div>
  );
};

export default AppTest;



