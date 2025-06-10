import { BlockData } from '../components/blocks/BlockRenderer';

const STORAGE_KEYS = {
  BLOCKS_STATE: '@smappli_blocks_state',
  LAST_UPDATED: '@smappli_last_updated',
  VERSION: '@smappli_version',
};

export interface AppState {
  blocks: BlockData[];
  lastUpdated: string;
  version: string;
}

export class StateService {
  /**
   * Lưu state hiện tại của blocks
   */
  static async saveState(blocks: BlockData[]): Promise<void> {
    try {
      const state: AppState = {
        blocks,
        lastUpdated: new Date().toISOString(),
        version: '1.0.0',
      };

      localStorage.setItem(STORAGE_KEYS.BLOCKS_STATE, JSON.stringify(state));
      console.log('State saved successfully');
    } catch (error) {
      console.error('Error saving state:', error);
      throw error;
    }
  }

  /**
   * Khôi phục state đã lưu
   */
  static async loadState(): Promise<AppState | null> {
    try {
      const savedState = localStorage.getItem(STORAGE_KEYS.BLOCKS_STATE);
      
      if (savedState) {
        const state: AppState = JSON.parse(savedState);
        console.log('State loaded successfully:', state.lastUpdated);
        return state;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading state:', error);
      return null;
    }
  }

  /**
   * Kiểm tra xem có state đã lưu hay không
   */
  static async hasState(): Promise<boolean> {
    try {
      const savedState = localStorage.getItem(STORAGE_KEYS.BLOCKS_STATE);
      return savedState !== null;
    } catch (error) {
      console.error('Error checking state:', error);
      return false;
    }
  }

  /**
   * Xóa state đã lưu
   */
  static async clearState(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.BLOCKS_STATE);
      console.log('State cleared successfully');
    } catch (error) {
      console.error('Error clearing state:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin về state đã lưu
   */
  static async getStateInfo(): Promise<{ lastUpdated: string; version: string } | null> {
    try {
      const savedState = localStorage.getItem(STORAGE_KEYS.BLOCKS_STATE);
      
      if (savedState) {
        const state: AppState = JSON.parse(savedState);
        return {
          lastUpdated: state.lastUpdated,
          version: state.version,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting state info:', error);
      return null;
    }
  }

  /**
   * So sánh state hiện tại với state đã lưu
   */
  static async compareWithSavedState(currentBlocks: BlockData[]): Promise<boolean> {
    try {
      const savedState = await this.loadState();
      
      if (!savedState) {
        return false; // Không có state đã lưu
      }

      // So sánh đơn giản bằng cách stringify
      const currentStateString = JSON.stringify(currentBlocks);
      const savedStateString = JSON.stringify(savedState.blocks);
      
      return currentStateString === savedStateString;
    } catch (error) {
      console.error('Error comparing states:', error);
      return false;
    }
  }
} 