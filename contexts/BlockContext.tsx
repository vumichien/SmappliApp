import { BlockData } from '@/components/blocks/BlockRenderer';
import { ApiResponse, apiService, BlockConfig } from '@/services/ApiService';
import { BlockImportService } from '@/services/BlockImportService';
import { ImageService } from '@/services/ImageService';
import { StateService } from '@/services/StateService';
import { webSocketService } from '@/services/WebSocketService';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface BlockContextType {
  blocks: BlockData[];
  setBlocks: (blocks: BlockData[]) => void;
  loading: boolean;
  loadSampleData: () => Promise<void>;
  importFromJSON: (jsonString: string) => Promise<void>;
  exportToJSON: () => string;
  // State management methods
  saveCurrentState: () => Promise<void>;
  loadSavedState: () => Promise<void>;
  clearSavedState: () => Promise<void>;
  hasSavedState: () => Promise<boolean>;
  getSavedStateInfo: () => Promise<{ lastUpdated: string; version: string } | null>;
  // WebSocket methods
  connectWebSocket: () => Promise<boolean>;
  disconnectWebSocket: () => void;
  isWebSocketConnected: () => boolean;
  getWebSocketState: () => string;
  // API methods
  syncWithServer: () => Promise<ApiResponse<BlockConfig>>;
  uploadToServer: () => Promise<ApiResponse<BlockConfig>>;
  downloadFromServer: () => Promise<ApiResponse<BlockConfig>>;
  setApiBaseUrl: (url: string) => void;
}

const BlockContext = createContext<BlockContextType | undefined>(undefined);

interface BlockProviderProps {
  children: ReactNode;
}

export function BlockProvider({ children }: BlockProviderProps) {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-save state whenever blocks change
  useEffect(() => {
    if (blocks.length > 0) {
      StateService.saveState(blocks).catch(error => {
        console.error('Auto-save failed:', error);
      });
    }
  }, [blocks]);

  // Setup WebSocket listeners
  useEffect(() => {
    const handleBuildRequest = async (data: any) => {
      console.log('🚀 BlockContext: Received build request from web app:', data);
      
      if (data && data.blocks) {
        try {
          setLoading(true);
          console.log('🔄 BlockContext: Processing blocks:', data.blocks);
          
          // Process images if included
          if (data.images && Object.keys(data.images).length > 0) {
            console.log('📷 BlockContext: Processing', Object.keys(data.images).length, 'images');
            
            // Save images to local storage
            for (const [imageId, base64] of Object.entries(data.images)) {
              try {
                await ImageService.saveImage(base64 as string, `${imageId}.jpg`);
                console.log('💾 Saved image:', imageId);
              } catch (error) {
                console.error('❌ Failed to save image:', imageId, error);
              }
            }
            
            // Update image blocks to use local image references
            const processedBlocks = data.blocks.map((block: any) => {
              if (block.type === 'image' && block.source.startsWith('data:')) {
                // Extract base64 and find corresponding imageId
                const base64 = block.source.split(',')[1];
                const imageId = block.imageId || Object.keys(data.images).find(id => data.images[id] === base64);
                
                if (imageId) {
                  return {
                    ...block,
                    source: `local://${imageId}`,
                    imageId: imageId
                  };
                }
              } else if (block.type === 'gallery' && block.images) {
                // Process gallery images
                const processedImages = block.images.map((image: any) => {
                  if (image.source.startsWith('data:')) {
                    const base64 = image.source.split(',')[1];
                    const imageId = image.imageId || Object.keys(data.images).find(id => data.images[id] === base64);
                    
                    if (imageId) {
                      return {
                        ...image,
                        source: `local://${imageId}`,
                        imageId: imageId
                      };
                    }
                  }
                  return image;
                });
                
                return {
                  ...block,
                  images: processedImages
                };
              }
              return block;
            });
            
            const validatedBlocks = BlockImportService.validateAndProcessBlocks(processedBlocks);
            setBlocks(validatedBlocks);
          } else {
            // No images, process blocks normally
            const validatedBlocks = BlockImportService.validateAndProcessBlocks(data.blocks);
            setBlocks(validatedBlocks);
          }
          
          // Show notification to user
          if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification('SmappliApp Updated', {
                body: `New configuration received from web app${data.images ? ` with ${Object.keys(data.images).length} images` : ''}`,
                icon: '/icon.png'
              });
            }
          }
          
          console.log('✅ BlockContext: Successfully updated blocks from web app');
        } catch (error) {
          console.error('❌ BlockContext: Error processing build request:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.warn('⚠️ BlockContext: No blocks data in build request:', data);
      }
    };

    const handleConfigUpdate = async (data: any) => {
      console.log('Received config update from web app:', data);
      handleBuildRequest(data); // Same handling as build request
    };

    const handleConnected = () => {
      console.log('WebSocket connected to web app');
    };

    const handleDisconnected = () => {
      console.log('WebSocket disconnected from web app');
    };

    const handleError = (error: any) => {
      console.error('WebSocket error:', error);
    };

    // Register WebSocket event listeners
    webSocketService.on('buildRequest', handleBuildRequest);
    webSocketService.on('configUpdate', handleConfigUpdate);
    webSocketService.on('connected', handleConnected);
    webSocketService.on('disconnected', handleDisconnected);
    webSocketService.on('error', handleError);

    // Cleanup listeners on unmount
    return () => {
      webSocketService.off('buildRequest', handleBuildRequest);
      webSocketService.off('configUpdate', handleConfigUpdate);
      webSocketService.off('connected', handleConnected);
      webSocketService.off('disconnected', handleDisconnected);
      webSocketService.off('error', handleError);
    };
  }, []);

  const loadSampleData = async () => {
    try {
      setLoading(true);
      const sampleData = require('@/assets/data/sample-blocks.json');
      const validatedBlocks = BlockImportService.validateAndProcessBlocks(sampleData.blocks);
      setBlocks(validatedBlocks);
    } catch (error) {
      console.error('Error loading sample data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const importFromJSON = async (jsonString: string) => {
    try {
      setLoading(true);
      const parsedData = JSON.parse(jsonString);
      const validatedBlocks = BlockImportService.validateAndProcessBlocks(parsedData.blocks);
      setBlocks(validatedBlocks);
      // State will be auto-saved by useEffect
    } catch (error) {
      console.error('Error importing JSON:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = () => {
    const config: BlockConfig = {
      blocks,
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    };
    return JSON.stringify(config, null, 2);
  };

  // State Management Methods
  const saveCurrentState = async () => {
    try {
      await StateService.saveState(blocks);
    } catch (error) {
      console.error('Error saving current state:', error);
      throw error;
    }
  };

  const loadSavedState = async () => {
    try {
      setLoading(true);
      const savedState = await StateService.loadState();
      
      if (savedState) {
        setBlocks(savedState.blocks);
        console.log('Loaded saved state from:', savedState.lastUpdated);
      } else {
        // No saved state, load sample data
        await loadSampleData();
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
      // Fallback to sample data
      await loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const clearSavedState = async () => {
    try {
      await StateService.clearState();
    } catch (error) {
      console.error('Error clearing saved state:', error);
      throw error;
    }
  };

  const hasSavedState = async (): Promise<boolean> => {
    try {
      return await StateService.hasState();
    } catch (error) {
      console.error('Error checking saved state:', error);
      return false;
    }
  };

  const getSavedStateInfo = async () => {
    try {
      return await StateService.getStateInfo();
    } catch (error) {
      console.error('Error getting saved state info:', error);
      return null;
    }
  };

  // WebSocket Methods
  const connectWebSocket = async (): Promise<boolean> => {
    try {
      return await webSocketService.connect();
    } catch (error) {
      console.error('Error connecting WebSocket:', error);
      return false;
    }
  };

  const disconnectWebSocket = () => {
    webSocketService.disconnect();
  };

  const isWebSocketConnected = (): boolean => {
    return webSocketService.isConnected();
  };

  const getWebSocketState = (): string => {
    return webSocketService.getConnectionState();
  };

  // API Methods
  const syncWithServer = async (): Promise<ApiResponse<BlockConfig>> => {
    try {
      setLoading(true);
      const localConfig: BlockConfig = {
        blocks,
        version: '1.0.0',
        lastUpdated: new Date().toISOString()
      };

      const response = await apiService.syncConfiguration(localConfig);
      
      if (response.success && response.data) {
        setBlocks(response.data.blocks);
        // State will be auto-saved by useEffect
      }
      
      return response;
    } catch (error) {
      console.error('Error syncing with server:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const uploadToServer = async (): Promise<ApiResponse<BlockConfig>> => {
    try {
      setLoading(true);
      const config: BlockConfig = {
        blocks,
        version: '1.0.0',
        lastUpdated: new Date().toISOString()
      };

      // Validate before uploading
      const validation = apiService.validateConfiguration(config);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      const response = await apiService.updateConfiguration(config);
      return response;
    } catch (error) {
      console.error('Error uploading to server:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const downloadFromServer = async (): Promise<ApiResponse<BlockConfig>> => {
    try {
      setLoading(true);
      const response = await apiService.getConfiguration();
      
      if (response.success && response.data) {
        setBlocks(response.data.blocks);
        // State will be auto-saved by useEffect
      }
      
      return response;
    } catch (error) {
      console.error('Error downloading from server:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Download failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const setApiBaseUrl = (url: string) => {
    apiService.setBaseUrl(url);
  };

  // Initialize: Load saved state or sample data
  useEffect(() => {
    loadSavedState();
    
    // Auto-connect WebSocket after a short delay
    setTimeout(() => {
      console.log('🔌 Auto-connecting WebSocket...');
      connectWebSocket().then(connected => {
        if (connected) {
          console.log('✅ Auto-connect WebSocket successful');
        } else {
          console.log('❌ Auto-connect WebSocket failed');
        }
      });
    }, 2000);
  }, []);

  const value: BlockContextType = {
    blocks,
    setBlocks,
    loading,
    loadSampleData,
    importFromJSON,
    exportToJSON,
    saveCurrentState,
    loadSavedState,
    clearSavedState,
    hasSavedState,
    getSavedStateInfo,
    connectWebSocket,
    disconnectWebSocket,
    isWebSocketConnected,
    getWebSocketState,
    syncWithServer,
    uploadToServer,
    downloadFromServer,
    setApiBaseUrl,
  };

  return (
    <BlockContext.Provider value={value}>
      {children}
    </BlockContext.Provider>
  );
}

export function useBlocks() {
  const context = useContext(BlockContext);
  if (context === undefined) {
    throw new Error('useBlocks must be used within a BlockProvider');
  }
  return context;
} 