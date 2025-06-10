import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBuilder } from '../contexts/BuilderContext';

/**
 * Connection status component showing WebSocket connection state
 * and providing manual sync controls and data management
 */
const ConnectionStatus: React.FC = () => {
  const { state, connect, disconnect, sendToMobile, syncWithMobile, loadSampleData, clearBlocks } = useBuilder();

  const getStatusColor = () => {
    switch (state.connectionStatus) {
      case 'connected': return '#34C759';
      case 'connecting': return '#FF9500';
      case 'error': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getStatusText = () => {
    switch (state.connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Error';
      default: return 'Disconnected';
    }
  };

  const formatLastSync = () => {
    if (!state.lastSync) return 'Never';
    const date = new Date(state.lastSync);
    return date.toLocaleTimeString();
  };

  const handleConnectionToggle = () => {
    if (state.isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WebSocket Connection</Text>
        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: state.isConnected ? '#FF3B30' : '#34C759' }]}
          onPress={handleConnectionToggle}
        >
          <Text style={styles.toggleText}>
            {state.isConnected ? 'Disconnect' : 'Connect'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
        {state.connectionStatus === 'connected' && (
          <Text style={styles.connectedText}>• Real-time sync active</Text>
        )}
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Blocks:</Text>
        <Text style={styles.infoValue}>{state.blocks.length}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Selected:</Text>
        <Text style={styles.infoValue}>{state.selectedBlockId || 'None'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Last Sync:</Text>
        <Text style={styles.infoValue}>{formatLastSync()}</Text>
      </View>

      {/* Data Management Section */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>Data Management</Text>
      
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionButton, styles.sampleButton]} onPress={loadSampleData}>
          <Text style={styles.actionText}>Load Sample</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.clearButton]} onPress={clearBlocks}>
          <Text style={styles.actionText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Sync Controls */}
      {state.isConnected && (
        <>
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionTitle}>Sync Controls</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, styles.syncButton]} onPress={sendToMobile}>
              <Text style={styles.actionText}>Send to Mobile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.syncButton]} onPress={syncWithMobile}>
              <Text style={styles.actionText}>Sync Now</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Text style={styles.urlText}>ws://localhost:8081/ws</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  connectedText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
  },
  infoValue: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '500',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E1E5E9',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  sampleButton: {
    backgroundColor: '#34C759',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  syncButton: {
    backgroundColor: '#007AFF',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  urlText: {
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'monospace',
  },
});

export default ConnectionStatus; 