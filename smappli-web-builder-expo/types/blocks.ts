/**
 * Block types and interfaces for Smappli Web Builder
 * Updated to match sample-blocks.json format
 */

export type BlockType = 'title' | 'text' | 'image' | 'button' | 'gallery';

export interface BaseBlock {
  id?: string;
  type: BlockType;
  style?: BlockStyle;
}

export interface BlockStyle {
  backgroundColor?: string;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  textAlign?: 'left' | 'center' | 'right';
}

export interface TitleBlock extends BaseBlock {
  type: 'title';
  text: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
  fontSize?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  source: string;
  borderRadius?: number;
}

export interface ButtonItem {
  label: string;
  variant?: 'primary' | 'secondary';
  action?: string;
  message?: string;
}

export interface ButtonBlock extends BaseBlock {
  type: 'button';
  title?: string;
  titleSize?: 'small' | 'medium' | 'large';
  titleColor?: string;
  buttons: ButtonItem[];
}

export interface GalleryImage {
  source: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'square' | 'rounded';
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  title?: string;
  titleSize?: 'small' | 'medium' | 'large';
  titleColor?: string;
  columns?: number;
  images: GalleryImage[];
}

export type Block = TitleBlock | TextBlock | ImageBlock | ButtonBlock | GalleryBlock;

export interface BlockTemplate {
  id: string;
  name: string;
  description: string;
  block: Block;
  category: 'basic' | 'media' | 'interactive';
}

export interface WebSocketMessage {
  type: 'blocks_update' | 'blocks_sync' | 'block_add' | 'block_remove' | 'block_update' | 'BUILD_REQUEST' | 'PING' | 'PONG' | 'connection' | 'connection_ack';
  data: any;
}

export interface BuilderState {
  blocks: Block[];
  selectedBlockId: string | null;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
} 