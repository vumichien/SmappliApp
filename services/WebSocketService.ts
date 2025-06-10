import { BlockData } from '@/components/blocks/BlockRenderer';

export interface WebSocketMessage {
  type: 'BUILD_REQUEST' | 'CONFIG_UPDATE' | 'PING' | 'PONG';
  data?: {
    blocks?: BlockData[];
    images?: { [key: string]: string };
    version?: string;
    timestamp?: string;
  };
  source?: string;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private listeners: { [key: string]: Function[] } = {};
  private isConnecting = false;

  constructor(private url: string = 'ws://localhost:8081/ws') {
    console.log('WebSocketService initialized with URL:', this.url);
  }

  /**
   * Kết nối tới WebSocket server
   */
  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
        resolve(true);
        return;
      }

      this.isConnecting = true;

      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected to:', this.url);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.emit('connected');
          
          // Send ping to identify as mobile app
          console.log('Sending PING to identify as mobile-app');
          this.send({
            type: 'PING',
            source: 'mobile-app'
          });
          
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnecting = false;
          this.emit('disconnected');
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          this.emit('error', error);
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  /**
   * Ngắt kết nối WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }

  /**
   * Gửi message qua WebSocket
   */
  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  /**
   * Xử lý message nhận được
   */
  private handleMessage(message: WebSocketMessage) {
    console.log('Received WebSocket message:', message.type, message);
    
    switch (message.type) {
      case 'BUILD_REQUEST':
        console.log('Processing BUILD_REQUEST with data:', message.data);
        this.emit('buildRequest', message.data);
        break;
      case 'CONFIG_UPDATE':
        console.log('Processing CONFIG_UPDATE with data:', message.data);
        this.emit('configUpdate', message.data);
        break;
      case 'PONG':
        console.log('Received PONG response');
        this.emit('pong');
        break;
      default:
        console.log('Unknown message type:', message.type);
        this.emit('message', message);
    }
  }

  /**
   * Thử kết nối lại
   */
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch(() => {
        // Reconnection failed, will try again
      });
    }, this.reconnectInterval);
  }

  /**
   * Đăng ký listener cho events
   */
  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Hủy đăng ký listener
   */
  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  /**
   * Emit event tới listeners
   */
  private emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Kiểm tra trạng thái kết nối
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Lấy trạng thái kết nối
   */
  getConnectionState(): string {
    if (!this.ws) return 'DISCONNECTED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'CONNECTED';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'DISCONNECTED';
      default: return 'UNKNOWN';
    }
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService(); 