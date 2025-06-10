import { apiService } from './ApiService';

const STORAGE_KEYS = {
  IMAGES: '@smappli_images',
  IMAGE_CACHE: '@smappli_image_cache',
};

export interface ImageData {
  id: string;
  base64: string;
  filename: string;
  timestamp: string;
  synced: boolean;
  url?: string;
}

export class ImageService {
  /**
   * Lưu ảnh vào local storage
   */
  static async saveImage(base64Data: string, filename?: string): Promise<string> {
    try {
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const imageData: ImageData = {
        id: imageId,
        base64: base64Data,
        filename: filename || `image_${Date.now()}.png`,
        timestamp: new Date().toISOString(),
        synced: false,
      };

      // Get existing images
      const existingImages = await this.getAllImages();
      existingImages[imageId] = imageData;

      // Save to storage
      localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(existingImages));
      
      console.log('Image saved locally:', imageId);
      return imageId;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }

  /**
   * Lấy ảnh theo ID
   */
  static async getImage(imageId: string): Promise<ImageData | null> {
    try {
      const images = await this.getAllImages();
      return images[imageId] || null;
    } catch (error) {
      console.error('Error getting image:', error);
      return null;
    }
  }

  /**
   * Lấy tất cả ảnh
   */
  static async getAllImages(): Promise<{ [key: string]: ImageData }> {
    try {
      const imagesJson = localStorage.getItem(STORAGE_KEYS.IMAGES);
      return imagesJson ? JSON.parse(imagesJson) : {};
    } catch (error) {
      console.error('Error getting all images:', error);
      return {};
    }
  }

  /**
   * Xóa ảnh
   */
  static async deleteImage(imageId: string): Promise<void> {
    try {
      const images = await this.getAllImages();
      delete images[imageId];
      localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
      console.log('Image deleted:', imageId);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Upload ảnh lên server
   */
  static async uploadImageToServer(imageId: string): Promise<boolean> {
    try {
      const imageData = await this.getImage(imageId);
      if (!imageData) {
        throw new Error('Image not found');
      }

      const response = await apiService.uploadImage(imageData.base64, imageData.filename);
      
      if (response.success && response.data) {
        // Update local image data with server info
        imageData.synced = true;
        imageData.url = response.data.url;
        
        const images = await this.getAllImages();
        images[imageId] = imageData;
        localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
        
        console.log('Image uploaded to server:', imageId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error uploading image to server:', error);
      return false;
    }
  }

  /**
   * Sync tất cả ảnh chưa được upload
   */
  static async syncAllImages(): Promise<{ success: number; failed: number }> {
    try {
      const images = await this.getAllImages();
      const unsyncedImages = Object.keys(images).filter(id => !images[id].synced);
      
      let success = 0;
      let failed = 0;
      
      for (const imageId of unsyncedImages) {
        const uploaded = await this.uploadImageToServer(imageId);
        if (uploaded) {
          success++;
        } else {
          failed++;
        }
      }
      
      console.log(`Image sync completed: ${success} success, ${failed} failed`);
      return { success, failed };
    } catch (error) {
      console.error('Error syncing images:', error);
      return { success: 0, failed: 0 };
    }
  }

  /**
   * Lấy base64 data cho hiển thị
   */
  static async getImageBase64(imageId: string): Promise<string | null> {
    try {
      const imageData = await this.getImage(imageId);
      return imageData ? imageData.base64 : null;
    } catch (error) {
      console.error('Error getting image base64:', error);
      return null;
    }
  }

  /**
   * Convert file to base64
   */
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/...;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Xóa tất cả ảnh
   */
  static async clearAllImages(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.IMAGES);
      console.log('All images cleared');
    } catch (error) {
      console.error('Error clearing images:', error);
      throw error;
    }
  }

  /**
   * Lấy thống kê ảnh
   */
  static async getImageStats(): Promise<{ total: number; synced: number; unsynced: number }> {
    try {
      const images = await this.getAllImages();
      const imageArray = Object.values(images);
      
      return {
        total: imageArray.length,
        synced: imageArray.filter(img => img.synced).length,
        unsynced: imageArray.filter(img => !img.synced).length,
      };
    } catch (error) {
      console.error('Error getting image stats:', error);
      return { total: 0, synced: 0, unsynced: 0 };
    }
  }
} 