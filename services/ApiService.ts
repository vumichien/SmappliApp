import { BlockData } from '@/components/blocks/BlockRenderer';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface BlockConfig {
  blocks: BlockData[];
  version?: string;
  lastUpdated?: string;
  images?: { [key: string]: string }; // Map of image IDs to base64 data
}

export interface ImageUploadResponse {
  imageId: string;
  url: string;
  base64?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8081') {
    this.baseUrl = baseUrl;
  }

  // Update base URL for different environments
  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  // Get current configuration from server
  async getConfiguration(): Promise<ApiResponse<BlockConfig>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/blocks/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Configuration retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching configuration:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Send updated configuration to server with images
  async updateConfiguration(config: BlockConfig): Promise<ApiResponse<BlockConfig>> {
    try {
      const payload = {
        ...config,
        lastUpdated: new Date().toISOString(),
        version: config.version || '1.0.0'
      };

      const response = await fetch(`${this.baseUrl}/api/blocks/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Configuration updated successfully'
      };
    } catch (error) {
      console.error('Error updating configuration:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update configuration'
      };
    }
  }

  // Upload single image as base64
  async uploadImage(base64Data: string, filename?: string): Promise<ApiResponse<ImageUploadResponse>> {
    try {
      const payload = {
        image: base64Data,
        filename: filename || `image_${Date.now()}.png`,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${this.baseUrl}/api/images/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Image uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image'
      };
    }
  }

  // Get image by ID
  async getImage(imageId: string): Promise<ApiResponse<{ base64: string; url: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/images/${imageId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Image retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch image'
      };
    }
  }

  // Upload configuration with embedded images
  async uploadConfigurationWithImages(config: BlockConfig, images: { [key: string]: string }): Promise<ApiResponse<BlockConfig>> {
    try {
      const payload = {
        ...config,
        images,
        lastUpdated: new Date().toISOString(),
        version: config.version || '1.0.0'
      };

      const response = await fetch(`${this.baseUrl}/api/blocks/config-with-images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Configuration with images uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading configuration with images:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload configuration with images'
      };
    }
  }

  // Upload configuration file
  async uploadConfigurationFile(file: File): Promise<ApiResponse<BlockConfig>> {
    try {
      const formData = new FormData();
      formData.append('config', file);

      const response = await fetch(`${this.baseUrl}/api/blocks/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Configuration file uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading configuration file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload configuration file'
      };
    }
  }

  // Validate configuration before sending
  validateConfiguration(config: BlockConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.blocks || !Array.isArray(config.blocks)) {
      errors.push('Configuration must contain a blocks array');
    }

    if (config.blocks) {
      config.blocks.forEach((block, index) => {
        if (!block.type) {
          errors.push(`Block at index ${index} is missing type`);
        }

        const validTypes = ['title', 'text', 'image', 'gallery', 'button'];
        if (block.type && !validTypes.includes(block.type)) {
          errors.push(`Block at index ${index} has invalid type: ${block.type}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Sync configuration with server (get latest and merge if needed)
  async syncConfiguration(localConfig: BlockConfig): Promise<ApiResponse<BlockConfig>> {
    try {
      // First, get the latest configuration from server
      const serverResponse = await this.getConfiguration();
      
      if (!serverResponse.success || !serverResponse.data) {
        // If server doesn't have config, upload local config
        return await this.updateConfiguration(localConfig);
      }

      const serverConfig = serverResponse.data;
      const serverTime = new Date(serverConfig.lastUpdated || 0).getTime();
      const localTime = new Date(localConfig.lastUpdated || 0).getTime();

      // If server config is newer, return it
      if (serverTime > localTime) {
        return {
          success: true,
          data: serverConfig,
          message: 'Server configuration is newer, using server version'
        };
      }

      // If local config is newer or same, update server
      return await this.updateConfiguration(localConfig);
    } catch (error) {
      console.error('Error syncing configuration:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sync configuration'
      };
    }
  }

  // Health check endpoint
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Server is healthy'
      };
    } catch (error) {
      console.error('Error checking server health:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Server health check failed'
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default ApiService; 