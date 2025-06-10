import { BlockConfig, BlockData } from '../components/blocks/BlockRenderer';

export class BlockImportService {
  static validateBlockData(data: any): data is BlockConfig {
    if (!data || typeof data !== 'object') {
      return false;
    }

    if (!Array.isArray(data.blocks)) {
      return false;
    }

    // Validate each block
    for (const block of data.blocks) {
      if (!this.validateBlock(block)) {
        return false;
      }
    }

    return true;
  }

  static validateAndProcessBlocks(blocks: any[]): BlockData[] {
    if (!Array.isArray(blocks)) {
      throw new Error('Blocks must be an array');
    }

    const validatedBlocks: BlockData[] = [];
    
    for (const block of blocks) {
      if (this.validateBlock(block)) {
        validatedBlocks.push(block);
      } else {
        console.warn('Invalid block found and skipped:', block);
      }
    }

    return validatedBlocks;
  }

  static validateBlock(block: any): block is BlockData {
    if (!block || typeof block !== 'object' || !block.type) {
      return false;
    }

    switch (block.type) {
      case 'title':
        return typeof block.text === 'string';
      
      case 'text':
        return typeof block.content === 'string';
      
      case 'image':
        return typeof block.source === 'string';
      
      case 'gallery':
        return Array.isArray(block.images) && 
               block.images.every((img: any) => typeof img.source === 'string');
      
      case 'button':
        return Array.isArray(block.buttons) && 
               block.buttons.every((btn: any) => typeof btn.label === 'string');
      
      default:
        return false;
    }
  }

  static async importFromJSON(jsonString: string): Promise<BlockConfig> {
    try {
      const data = JSON.parse(jsonString);
      
      if (!this.validateBlockData(data)) {
        throw new Error('Invalid block data format');
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to import JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async loadSampleData(): Promise<BlockConfig> {
    // In a real app, you might load this from AsyncStorage or a file
    const sampleData = require('../assets/data/sample-blocks.json');
    return sampleData;
  }

  static exportToJSON(blocks: BlockData[]): string {
    const config: BlockConfig = { blocks };
    return JSON.stringify(config, null, 2);
  }
} 