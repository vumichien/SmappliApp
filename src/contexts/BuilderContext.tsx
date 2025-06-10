import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { webSocketService } from '../services/WebSocketService';
import { Component } from '../types/components';

interface BuilderContextType {
  // Components state
  components: Component[];
  selectedComponentId: string | null;
  
  // WebSocket state
  isConnected: boolean;
  connectionState: string;
  
  // Actions
  addComponent: (component: Component) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  moveComponent: (fromIndex: number, toIndex: number) => void;
  
  // WebSocket actions
  connectWebSocket: () => Promise<boolean>;
  disconnectWebSocket: () => void;
  sendBuildRequest: () => void;
  
  // Utility
  getSelectedComponent: () => Component | null;
  clearAll: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};

interface BuilderProviderProps {
  children: React.ReactNode;
}

export const BuilderProvider: React.FC<BuilderProviderProps> = ({ children }) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('DISCONNECTED');

  // Initialize WebSocket listeners
  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
      setConnectionState('CONNECTED');
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setConnectionState('DISCONNECTED');
    };

    const handleError = (error: any) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      setConnectionState('ERROR');
    };

    webSocketService.on('connected', handleConnected);
    webSocketService.on('disconnected', handleDisconnected);
    webSocketService.on('error', handleError);

    // Update connection state periodically
    const interval = setInterval(() => {
      setConnectionState(webSocketService.getConnectionState());
      setIsConnected(webSocketService.isConnected());
    }, 1000);

    return () => {
      webSocketService.off('connected', handleConnected);
      webSocketService.off('disconnected', handleDisconnected);
      webSocketService.off('error', handleError);
      clearInterval(interval);
    };
  }, []);

  // Component management
  const addComponent = useCallback((component: Component) => {
    const newComponent = {
      ...component,
      id: `${component.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setComponents(prev => [...prev, newComponent]);
    setSelectedComponentId(newComponent.id);
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<Component>) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      )
    );
  }, []);

  const removeComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId]);

  const selectComponent = useCallback((id: string | null) => {
    setSelectedComponentId(id);
  }, []);

  const moveComponent = useCallback((fromIndex: number, toIndex: number) => {
    setComponents(prev => {
      const newComponents = [...prev];
      const [movedComponent] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, movedComponent);
      return newComponents;
    });
  }, []);

  const getSelectedComponent = useCallback(() => {
    if (!selectedComponentId) return null;
    return components.find(comp => comp.id === selectedComponentId) || null;
  }, [components, selectedComponentId]);

  const clearAll = useCallback(() => {
    setComponents([]);
    setSelectedComponentId(null);
  }, []);

  // WebSocket management
  const connectWebSocket = useCallback(async () => {
    try {
      return await webSocketService.connect();
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      return false;
    }
  }, []);

  const disconnectWebSocket = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  const sendBuildRequest = useCallback(() => {
    if (!isConnected) {
      console.warn('WebSocket not connected, cannot send build request');
      return;
    }

    // Convert components to the format expected by mobile app
    const blocks = components.map(comp => {
      switch (comp.type) {
        case 'title':
          return {
            type: 'title',
            text: comp.content,
            size: comp.size || 'medium',
            color: comp.style?.color || '#000',
            style: comp.style
          };
        case 'text':
          return {
            type: 'text',
            content: comp.content,
            fontSize: comp.style?.fontSize || 16,
            color: comp.style?.color || '#333',
            textAlign: comp.style?.textAlign || 'left',
            style: comp.style
          };
        case 'image':
          return {
            type: 'image',
            source: comp.source,
            borderRadius: comp.borderRadius || 0,
            style: comp.style
          };
        case 'button':
          return {
            type: 'button',
            content: comp.content,
            variant: comp.variant || 'primary',
            action: comp.action,
            message: comp.message,
            style: comp.style
          };
        case 'gallery':
          return {
            type: 'gallery',
            title: comp.title,
            titleSize: comp.titleSize || 'medium',
            titleColor: comp.titleColor || '#000',
            columns: comp.columns || 3,
            images: comp.images || [],
            style: comp.style
          };
        default:
          return comp;
      }
    });

    webSocketService.sendBuildRequest(blocks);
  }, [components, isConnected]);

  const value: BuilderContextType = {
    // State
    components,
    selectedComponentId,
    isConnected,
    connectionState,
    
    // Actions
    addComponent,
    updateComponent,
    removeComponent,
    selectComponent,
    moveComponent,
    
    // WebSocket
    connectWebSocket,
    disconnectWebSocket,
    sendBuildRequest,
    
    // Utility
    getSelectedComponent,
    clearAll
  };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
}; 