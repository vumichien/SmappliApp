import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { loadSampleBlocks } from '../services/SampleDataService';
import { webSocketService } from '../services/WebSocketService';
import { Block, BuilderState, WebSocketMessage } from '../types/blocks';

/**
 * Enhanced Builder Context for managing web builder state
 * Handles blocks, selection, and WebSocket connection with localStorage persistence
 */

interface BuilderContextType {
  state: BuilderState;
  addBlock: (block: Block) => void;
  removeBlock: (blockId: string) => void;
  updateBlock: (block: Block) => void;
  selectBlock: (blockId: string | null) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendToMobile: () => void;
  syncWithMobile: () => void;
  loadSampleData: () => void;
  clearBlocks: () => void;
  resetToSample: () => void;
}

type BuilderAction =
  | { type: 'SET_BLOCKS'; payload: Block[] }
  | { type: 'ADD_BLOCK'; payload: Block }
  | { type: 'REMOVE_BLOCK'; payload: string }
  | { type: 'UPDATE_BLOCK'; payload: Block }
  | { type: 'SELECT_BLOCK'; payload: string | null }
  | { type: 'MOVE_BLOCK'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'SET_CONNECTION_STATUS'; payload: BuilderState['connectionStatus'] }
  | { type: 'SET_LAST_SYNC'; payload: string }
  | { type: 'CLEAR_BLOCKS' }
  | { type: 'LOAD_STATE'; payload: BuilderState };

// Storage keys
const STORAGE_KEYS = {
  BUILDER_STATE: 'smappli_builder_state',
  LAST_SAVE: 'smappli_last_save'
};

// Load state from localStorage
const loadStateFromStorage = (): Partial<BuilderState> | null => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEYS.BUILDER_STATE);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      console.log('📂 Loaded state from localStorage:', parsed);
      return parsed;
    }
  } catch (error) {
    console.error('❌ Error loading state from localStorage:', error);
  }
  return null;
};

// Save state to localStorage
const saveStateToStorage = (state: BuilderState) => {
  try {
    const stateToSave = {
      blocks: state.blocks,
      selectedBlockId: state.selectedBlockId,
      lastSync: state.lastSync
    };
    localStorage.setItem(STORAGE_KEYS.BUILDER_STATE, JSON.stringify(stateToSave));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
    console.log('💾 Saved state to localStorage');
  } catch (error) {
    console.error('❌ Error saving state to localStorage:', error);
  }
};

const initialState: BuilderState = {
  blocks: [],
  selectedBlockId: null,
  isConnected: false,
  connectionStatus: 'disconnected',
  lastSync: null
};

const builderReducer = (state: BuilderState, action: BuilderAction): BuilderState => {
  let newState: BuilderState;

  switch (action.type) {
    case 'LOAD_STATE':
      newState = {
        ...state,
        ...action.payload,
        // Don't restore connection state
        isConnected: false,
        connectionStatus: 'disconnected'
      };
      break;

    case 'SET_BLOCKS':
      newState = {
        ...state,
        blocks: action.payload
      };
      break;

    case 'ADD_BLOCK':
      newState = {
        ...state,
        blocks: [...state.blocks, action.payload]
      };
      break;

    case 'REMOVE_BLOCK':
      newState = {
        ...state,
        blocks: state.blocks.filter(block => block.id !== action.payload),
        selectedBlockId: state.selectedBlockId === action.payload ? null : state.selectedBlockId
      };
      break;

    case 'UPDATE_BLOCK':
      newState = {
        ...state,
        blocks: state.blocks.map(block =>
          block.id === action.payload.id ? action.payload : block
        )
      };
      break;

    case 'SELECT_BLOCK':
      newState = {
        ...state,
        selectedBlockId: action.payload
      };
      break;

    case 'MOVE_BLOCK':
      const { fromIndex, toIndex } = action.payload;
      const newBlocks = [...state.blocks];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      newState = {
        ...state,
        blocks: newBlocks
      };
      break;

    case 'SET_CONNECTION_STATUS':
      newState = {
        ...state,
        connectionStatus: action.payload,
        isConnected: action.payload === 'connected'
      };
      break;

    case 'SET_LAST_SYNC':
      newState = {
        ...state,
        lastSync: action.payload
      };
      break;

    case 'CLEAR_BLOCKS':
      newState = {
        ...state,
        blocks: [],
        selectedBlockId: null
      };
      break;

    default:
      return state;
  }

  // Save to localStorage for persistent actions (not connection status)
  if (action.type !== 'SET_CONNECTION_STATUS' && action.type !== 'LOAD_STATE') {
    saveStateToStorage(newState);
  }

  return newState;
};

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

interface BuilderProviderProps {
  children: ReactNode;
}

export const BuilderProvider: React.FC<BuilderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  useEffect(() => {
    // Load saved state first
    const savedState = loadStateFromStorage();
    
    if (savedState && savedState.blocks && savedState.blocks.length > 0) {
      // Load from localStorage if available
      dispatch({ type: 'LOAD_STATE', payload: savedState as BuilderState });
      console.log('🔄 Restored state from localStorage');
    } else {
      // Load sample blocks only if no saved state
      const sampleBlocks = loadSampleBlocks();
      dispatch({ type: 'SET_BLOCKS', payload: sampleBlocks });
      console.log('📦 Loaded sample blocks (no saved state found)');
    }
    
    // Set up WebSocket event listeners with enhanced handling
    const handleStatusChange = (status: BuilderState['connectionStatus']) => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: status });
      
      if (status === 'connected') {
        console.log('🔗 WebSocket connected - syncing with mobile app');
        // Auto-sync when connected
        setTimeout(() => {
          syncWithMobile();
        }, 1000);
      }
    };

    const handleMessage = (message: WebSocketMessage) => {
      console.log('📨 Received WebSocket message:', message.type);
      
      switch (message.type) {
        case 'blocks_update':
        case 'blocks_sync':
          if (Array.isArray(message.data)) {
            dispatch({ type: 'SET_BLOCKS', payload: message.data });
            dispatch({ type: 'SET_LAST_SYNC', payload: new Date().toISOString() });
          } else if (message.data && Array.isArray(message.data.blocks)) {
            dispatch({ type: 'SET_BLOCKS', payload: message.data.blocks });
            dispatch({ type: 'SET_LAST_SYNC', payload: new Date().toISOString() });
          }
          break;
          
        case 'block_add':
          if (!Array.isArray(message.data)) {
            dispatch({ type: 'ADD_BLOCK', payload: message.data as Block });
          }
          break;
          
        case 'block_remove':
          if (typeof message.data === 'object' && 'id' in message.data) {
            dispatch({ type: 'REMOVE_BLOCK', payload: (message.data as { id: string }).id });
          }
          break;
          
        case 'block_update':
          if (!Array.isArray(message.data)) {
            dispatch({ type: 'UPDATE_BLOCK', payload: message.data as Block });
          }
          break;
          
        case 'BUILD_REQUEST':
          // Handle build requests from mobile app
          if (message.data && Array.isArray(message.data.blocks)) {
            dispatch({ type: 'SET_BLOCKS', payload: message.data.blocks });
            dispatch({ type: 'SET_LAST_SYNC', payload: new Date().toISOString() });
          }
          break;
          
        default:
          console.log('🔄 Unhandled message type:', message.type);
      }
    };

    webSocketService.on('statusChange', handleStatusChange);
    webSocketService.on('message', handleMessage);

    return () => {
      webSocketService.off('statusChange', handleStatusChange);
      webSocketService.off('message', handleMessage);
    };
  }, []);

  const addBlock = (block: Block) => {
    // Add ID if not present
    const blockWithId = {
      ...block,
      id: block.id || `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    dispatch({ type: 'ADD_BLOCK', payload: blockWithId });
    
    // Send to mobile app if connected
    if (state.isConnected) {
      webSocketService.sendBlockAdd(blockWithId);
    }
  };

  const removeBlock = (blockId: string) => {
    dispatch({ type: 'REMOVE_BLOCK', payload: blockId });
    
    // Send to mobile app if connected
    if (state.isConnected) {
      webSocketService.sendBlockRemove(blockId);
    }
  };

  const updateBlock = (block: Block) => {
    dispatch({ type: 'UPDATE_BLOCK', payload: block });
    
    // Send to mobile app if connected
    if (state.isConnected) {
      webSocketService.sendBlockUpdate(block);
    }
  };

  const selectBlock = (blockId: string | null) => {
    dispatch({ type: 'SELECT_BLOCK', payload: blockId });
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    dispatch({ type: 'MOVE_BLOCK', payload: { fromIndex, toIndex } });
    
    // Send updated blocks to mobile app if connected
    if (state.isConnected) {
      // Get updated blocks after move
      const newBlocks = [...state.blocks];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      webSocketService.sendBlocksUpdate(newBlocks);
    }
  };

  const connect = async () => {
    try {
      console.log('🔌 Connecting to WebSocket server...');
      await webSocketService.connect();
    } catch (error) {
      console.error('❌ Failed to connect to WebSocket:', error);
    }
  };

  const disconnect = () => {
    console.log('🔌 Disconnecting from WebSocket server...');
    webSocketService.disconnect();
  };

  const sendToMobile = () => {
    if (state.isConnected) {
      console.log('📤 Sending blocks to mobile app:', state.blocks.length, 'blocks');
      webSocketService.sendBlocksUpdate(state.blocks);
      dispatch({ type: 'SET_LAST_SYNC', payload: new Date().toISOString() });
    } else {
      console.warn('⚠️ Not connected to mobile app');
    }
  };

  const syncWithMobile = () => {
    if (state.isConnected) {
      console.log('🔄 Syncing with mobile app...');
      // Send current blocks to mobile app
      webSocketService.sendBlocksUpdate(state.blocks);
      dispatch({ type: 'SET_LAST_SYNC', payload: new Date().toISOString() });
    }
  };

  const loadSampleData = () => {
    console.log('📋 Loading sample blocks...');
    const sampleBlocks = loadSampleBlocks();
    dispatch({ type: 'SET_BLOCKS', payload: sampleBlocks });
    
    // Send to mobile app if connected
    if (state.isConnected) {
      webSocketService.sendBlocksUpdate(sampleBlocks);
      dispatch({ type: 'SET_LAST_SYNC', payload: new Date().toISOString() });
    }
  };

  const clearBlocks = () => {
    console.log('🗑️ Clearing all blocks...');
    dispatch({ type: 'CLEAR_BLOCKS' });
    
    // Send empty blocks to mobile app if connected
    if (state.isConnected) {
      webSocketService.sendBlocksUpdate([]);
      dispatch({ type: 'SET_LAST_SYNC', payload: new Date().toISOString() });
    }
  };

  const resetToSample = () => {
    console.log('🔄 Resetting to sample data...');
    clearBlocks();
    loadSampleData();
  };

  const contextValue: BuilderContextType = {
    state,
    addBlock,
    removeBlock,
    updateBlock,
    selectBlock,
    moveBlock,
    connect,
    disconnect,
    sendToMobile,
    syncWithMobile,
    loadSampleData,
    clearBlocks,
    resetToSample
  };

  return (
    <BuilderContext.Provider value={contextValue}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = (): BuilderContextType => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}; 