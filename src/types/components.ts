export interface ComponentStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  textAlign?: 'left' | 'center' | 'right';
}

export interface BaseComponent {
  id: string;
  type: string;
  style?: ComponentStyle;
}

export interface TitleComponent extends BaseComponent {
  type: 'title';
  content: string;
  size?: 'small' | 'medium' | 'large';
}

export interface TextComponent extends BaseComponent {
  type: 'text';
  content: string;
}

export interface ImageComponent extends BaseComponent {
  type: 'image';
  source: string;
  borderRadius?: number;
}

export interface ButtonComponent extends BaseComponent {
  type: 'button';
  content: string;
  variant?: 'primary' | 'secondary';
  action?: string;
  message?: string;
}

export interface GalleryImage {
  source: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'square' | 'rounded';
}

export interface GalleryComponent extends BaseComponent {
  type: 'gallery';
  title?: string;
  titleSize?: 'small' | 'medium' | 'large';
  titleColor?: string;
  columns?: number;
  images: GalleryImage[];
}

export type Component = 
  | TitleComponent 
  | TextComponent 
  | ImageComponent 
  | ButtonComponent 
  | GalleryComponent;

export interface ComponentTemplate {
  type: string;
  name: string;
  icon: string;
  defaultProps: Partial<Component>;
}

export interface WebSocketMessage {
  type: 'BUILD_REQUEST' | 'CONFIG_UPDATE' | 'PING' | 'PONG';
  data?: {
    blocks?: Component[];
    images?: { [key: string]: string };
    version?: string;
    timestamp?: string;
  };
  source?: string;
} 