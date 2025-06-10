import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LeftSidebar from './components/LeftSidebar';
import MobilePreview from './components/MobilePreview';
import RightSidebar from './components/RightSidebar';
import { BuilderProvider, useBuilder } from './contexts/BuilderContext';

/**
 * Build button component
 */
const BuildButton: React.FC = () => {
  const { sendToMobile, state } = useBuilder();

  const handleBuild = () => {
    sendToMobile();
  };

  return (
    <View style={styles.buildButtonContainer}>
      <TouchableOpacity
        style={[
          styles.buildButton,
          !state.isConnected && styles.buildButtonDisabled
        ]}
        onPress={handleBuild}
        disabled={!state.isConnected}
      >
        <Text style={styles.buildButtonIcon}>🚀</Text>
        <Text style={styles.buildButtonText}>Build</Text>
      </TouchableOpacity>
      
      {!state.isConnected && (
        <Text style={styles.buildHelpText}>
          Connect to mobile app to build
        </Text>
      )}
    </View>
  );
};

/**
 * Main App component for Smappli Web Builder
 * Three-column layout with external Build button
 */
const AppContent: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Left Sidebar - Components */}
      <View style={styles.leftSidebar}>
        <LeftSidebar />
      </View>

      {/* Center - Mobile Preview */}
      <View style={styles.centerPanel}>
        <ScrollView style={styles.centerScroll} showsVerticalScrollIndicator={false}>
          <MobilePreview />
        </ScrollView>
        
        {/* Build Button - Floating */}
        <BuildButton />
      </View>

      {/* Right Sidebar - Properties Only */}
      <View style={styles.rightSidebar}>
        <RightSidebar />
      </View>
    </View>
  );
};

export default function App() {
  return (
    <BuilderProvider>
      <AppContent />
    </BuilderProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    height: '100vh', // For web compatibility
  },
  leftSidebar: {
    width: 300,
    minWidth: 250,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E1E5E9',
  },
  centerPanel: {
    flex: 1,
    minWidth: 400,
    position: 'relative',
  },
  centerScroll: {
    flex: 1,
  },
  rightSidebar: {
    width: 320,
    minWidth: 280,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderLeftColor: '#E1E5E9',
  },
  buildButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    alignItems: 'center',
  },
  buildButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buildButtonDisabled: {
    backgroundColor: '#8E8E93',
  },
  buildButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  buildButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buildHelpText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
});
