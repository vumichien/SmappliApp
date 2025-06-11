import { Block, WebSocketMessage } from '../types/blocks';

/**
 * Enhanced WebSocket service for real-time communication with mobile app
 * Handles connection, reconnection, and message passing with improved reliability
 */

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private isManualDisconnect = false;

  constructor(config: Partial<WebSocketConfig> = {}) {
    this.config = {
      url: 'ws://localhost:8081/ws',
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config
    };
  }

  /**
   * Connect to WebSocket server with enhanced error handling
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isManualDisconnect = false;
        this.ws = new WebSocket(this.config.url);
        
        this.ws.onopen = () => {
          console.log('✅ WebSocket connected to Smappli server');
          this.reconnectAttempts = 0;
          this.emit('statusChange', 'connected');
          this.startHeartbeat();
          
          // Send initial connection message
          this.send({
            type: 'connection',
            data: {
              source: 'web-builder-expo',
              timestamp: new Date().toISOString()
            }
          });
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('❌ Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket disconnected:', event.code, event.reason);
          this.stopHeartbeat();
          this.emit('statusChange', 'disconnected');
          
          if (!this.isManualDisconnect) {
            this.attemptReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.emit('statusChange', 'error');
          reject(error);
        };

        // Set connecting status
        this.emit('statusChange', 'connecting');

      } catch (error) {
        console.error('❌ Failed to create WebSocket connection:', error);
        this.emit('statusChange', 'error');
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isManualDisconnect = true;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    this.emit('statusChange', 'disconnected');
  }

  /**
   * Send message to WebSocket server with validation
   */
  send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        console.log('📤 Sent message:', message.type);
      } catch (error) {
        console.error('❌ Failed to send message:', error);
      }
    } else {
      console.warn('⚠️ WebSocket is not connected. Message not sent:', message.type);
    }
  }

  /**
   * Send blocks update to mobile app with metadata
   */
  sendBlocksUpdate(blocks: Block[]): void {
    this.send({
      type: 'BUILD_REQUEST',
      data: {
        blocks,
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        source: 'web-builder-expo'
      }
    });
  }

  /**
   * Send blocks update with images to mobile app
   */
  sendBlocksUpdateWithImages(blocks: Block[], images: { [key: string]: string }): void {
    this.send({
      type: 'BUILD_REQUEST',
      data: {
        blocks,
        images,
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        source: 'web-builder-expo'
      }
    });
  }

  /**
   * Send single block addition
   */
  sendBlockAdd(block: Block): void {
    this.send({
      type: 'block_add',
      data: {
        ...block,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Send block removal
   */
  sendBlockRemove(blockId: string): void {
    this.send({
      type: 'block_remove',
      data: { 
        id: blockId,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Send block update
   */
  sendBlockUpdate(block: Block): void {
    this.send({
      type: 'block_update',
      data: {
        ...block,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Send ping to keep connection alive
   */
  sendPing(): void {
    this.send({
      type: 'PING',
      data: {
        source: 'web-builder-expo',
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  /**
   * Handle incoming WebSocket messages with enhanced processing
   */
  private handleMessage(message: WebSocketMessage): void {
    console.log('📥 Received message:', message.type);
    
    switch (message.type) {
      case 'PONG':
        console.log('💓 Heartbeat received');
        break;
      case 'connection_ack':
        console.log('🤝 Connection acknowledged by server');
        break;
      case 'blocks_sync':
        console.log('🔄 Blocks sync received');
        this.emit('message', message);
        break;
      default:
        this.emit('message', message);
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      this.emit('statusChange', 'error');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1),
      30000 // Max 30 seconds
    );

    console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts}) in ${delay}ms`);

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(error => {
        console.error('❌ Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.sendPing();
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat timer
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService(); 