import React from 'react';

const RightSidebar: React.FC = () => {
  return (
    <div style={{
      width: '350px',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      borderLeft: '1px solid #e9ecef',
      padding: '20px'
    }}>
      <h2>Properties Panel</h2>
      <p>Select a component to edit its properties</p>
    </div>
  );
};

export default RightSidebar; 