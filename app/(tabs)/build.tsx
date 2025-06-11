import { useBlocks } from '@/contexts/BlockContext';
import { apiService } from '@/services/ApiService';
import { ImageService } from '@/services/ImageService';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface StateInfo {
  lastUpdated: string;
  version: string;
}

interface ImageStats {
  total: number;
  synced: number;
  unsynced: number;
}

export default function BuildScreen() {
  const {
    blocks,
    loading,
    exportToJSON,
    importFromJSON,
    clearSavedState,
    getSavedStateInfo,
    connectWebSocket,
    disconnectWebSocket,
    isWebSocketConnected,
    getWebSocketState,
    syncWithServer,
    uploadToServer,
    downloadFromServer,
  } = useBlocks();

  const [stateInfo, setStateInfo] = useState<StateInfo | null>(null);
  const [imageStats, setImageStats] = useState<ImageStats>({ total: 0, synced: 0, unsynced: 0 });
  const [apiStatus, setApiStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');
  const [wsStatus, setWsStatus] = useState<string>('DISCONNECTED');

  // Load state info on mount
  useEffect(() => {
    loadStateInfo();
    loadImageStats();
    checkApiStatus();
    updateWebSocketStatus();
  }, []);

  // Update WebSocket status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updateWebSocketStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const updateWebSocketStatus = () => {
    const newStatus = getWebSocketState();
    setWsStatus(newStatus);
  };

  const loadStateInfo = async () => {
    try {
      const info = await getSavedStateInfo();
      setStateInfo(info);
    } catch (error) {
      console.error('Error loading state info:', error);
    }
  };

  const loadImageStats = async () => {
    try {
      const stats = await ImageService.getImageStats();
      setImageStats(stats);
    } catch (error) {
      console.error('Error loading image stats:', error);
    }
  };

  const checkApiStatus = async () => {
    try {
      const response = await apiService.healthCheck();
      setApiStatus(response.success ? 'online' : 'offline');
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const handleConnectWebSocket = async () => {
    try {
      const connected = await connectWebSocket();
      if (connected) {
        Alert.alert('Success', 'Connected to WebSocket server');
      } else {
        Alert.alert('Error', 'Failed to connect to WebSocket server');
      }
    } catch (error) {
      Alert.alert('Error', 'WebSocket connection failed');
    }
    updateWebSocketStatus();
  };

  const handleDisconnectWebSocket = () => {
    disconnectWebSocket();
    Alert.alert('Info', 'Disconnected from WebSocket server');
    updateWebSocketStatus();
  };

  const handleExportToClipboard = async () => {
    try {
      const jsonString = exportToJSON();
      // Simple clipboard copy for now
      Alert.alert('Export', 'Configuration ready to copy', [
        { text: 'OK', onPress: () => console.log('JSON:', jsonString) }
      ]);
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export configuration');
    }
  };

  const handleClearState = async () => {
    Alert.alert(
      'Clear Saved State',
      'Are you sure you want to clear all saved data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearSavedState();
              await loadStateInfo();
              Alert.alert('Success', 'Saved state cleared successfully!');
            } catch (error) {
              console.error('Clear state error:', error);
              Alert.alert('Error', 'Failed to clear saved state');
            }
          },
        },
      ]
    );
  };

  const handleSyncImages = async () => {
    try {
      await ImageService.syncAllImages();
      await loadImageStats();
      Alert.alert('Success', 'Images synced successfully!');
    } catch (error) {
      console.error('Sync images error:', error);
      Alert.alert('Error', 'Failed to sync images');
    }
  };

  const handleClearImages = async () => {
    Alert.alert(
      'Clear Images',
      'Are you sure you want to clear all local images?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await ImageService.clearAllImages();
              await loadImageStats();
              Alert.alert('Success', 'Images cleared successfully!');
            } catch (error) {
              console.error('Clear images error:', error);
              Alert.alert('Error', 'Failed to clear images');
            }
          },
        },
      ]
    );
  };

  const handleTestApi = async () => {
    try {
      const response = await apiService.healthCheck();
      if (response.success) {
        Alert.alert('API Test', `API is online!\nServer: ${response.data?.status}\nTime: ${response.data?.timestamp}`);
      } else {
        Alert.alert('API Test', `API is offline: ${response.error}`);
      }
      await checkApiStatus();
    } catch (error) {
      Alert.alert('API Test', 'Failed to connect to API');
      setApiStatus('offline');
    }
  };

  const handleSyncWithServer = async () => {
    try {
      const response = await syncWithServer();
      if (response.success) {
        await loadStateInfo();
        Alert.alert('Success', 'Configuration synced with server!');
      } else {
        Alert.alert('Error', `Sync failed: ${response.error}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sync with server');
    }
  };

  const handleUploadToServer = async () => {
    try {
      const response = await uploadToServer();
      if (response.success) {
        Alert.alert('Success', 'Configuration uploaded to server!');
      } else {
        Alert.alert('Error', `Upload failed: ${response.error}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload to server');
    }
  };

  const handleDownloadFromServer = async () => {
    try {
      const response = await downloadFromServer();
      if (response.success) {
        await loadStateInfo();
        Alert.alert('Success', 'Configuration downloaded from server!');
      } else {
        Alert.alert('Error', `Download failed: ${response.error}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download from server');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED': return '#4CAF50';
      case 'CONNECTING': return '#FF9800';
      case 'DISCONNECTED': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getApiStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'offline': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Build Configuration</Text>

      {/* WebSocket Connection Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔗 Real-time Connection</Text>
        <View style={styles.statusRow}>
          <Text style={styles.label}>WebSocket Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(wsStatus) }]}>
            <Text style={styles.statusText}>{wsStatus}</Text>
          </View>
        </View>
        <Text style={styles.description}>
          Connect to receive real-time updates from web app
        </Text>
        <View style={styles.buttonRow}>
          {wsStatus === 'CONNECTED' ? (
            <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleDisconnectWebSocket}>
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleConnectWebSocket}>
              <Text style={styles.buttonText}>Connect WebSocket</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Current State Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Current State</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Blocks:</Text>
          <Text style={styles.value}>{blocks.length}</Text>
        </View>
        {stateInfo && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Last Updated:</Text>
              <Text style={styles.value}>{new Date(stateInfo.lastUpdated).toLocaleString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Version:</Text>
              <Text style={styles.value}>{stateInfo.version}</Text>
            </View>
          </>
        )}
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleClearState}>
          <Text style={styles.buttonText}>Clear Saved State</Text>
        </TouchableOpacity>
      </View>

      {/* API Server Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌐 API Server</Text>
        <View style={styles.statusRow}>
          <Text style={styles.label}>Server Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getApiStatusColor(apiStatus) }]}>
            <Text style={styles.statusText}>{apiStatus.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.description}>
          Server: http://localhost:8082
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleTestApi}>
            <Text style={styles.buttonText}>Test API</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSyncWithServer}>
            <Text style={styles.buttonText}>Sync</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleUploadToServer}>
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDownloadFromServer}>
            <Text style={styles.buttonText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Management Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🖼️ Image Management</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Total Images:</Text>
          <Text style={styles.value}>{imageStats.total}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Synced:</Text>
          <Text style={styles.value}>{imageStats.synced}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Unsynced:</Text>
          <Text style={styles.value}>{imageStats.unsynced}</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleSyncImages}>
            <Text style={styles.buttonText}>Sync Images</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleClearImages}>
            <Text style={styles.buttonText}>Clear Images</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Export Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📁 Export Configuration</Text>
        <Text style={styles.description}>
          Export current configuration to console (clipboard support coming soon)
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleExportToClipboard}>
          <Text style={styles.buttonText}>Export to Console</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
}); 