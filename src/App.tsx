import React, { useEffect } from 'react';
import './App.css';
import LeftSidebar from './components/LeftSidebar';
import MobilePreview from './components/MobilePreview';
import RightSidebar from './components/RightSidebar';
import { BuilderProvider, useBuilder } from './contexts/BuilderContext';

const AppContent: React.FC = () => {
  const { connectWebSocket } = useBuilder();

  useEffect(() => {
    // Auto-connect to WebSocket when app starts
    connectWebSocket();
  }, [connectWebSocket]);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Left Sidebar - Component List & Templates */}
      <LeftSidebar />
      
      {/* Center - Mobile Preview */}
      <MobilePreview />
      
      {/* Right Sidebar - Properties Panel */}
      <RightSidebar />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BuilderProvider>
      <AppContent />
    </BuilderProvider>
  );
};

export default App; 