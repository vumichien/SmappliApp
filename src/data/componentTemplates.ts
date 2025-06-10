import { ComponentTemplate } from '../types/components';

export const componentTemplates: ComponentTemplate[] = [
  {
    type: 'title',
    name: 'Title',
    icon: 'Type',
    defaultProps: {
      type: 'title',
      content: 'New Title',
      size: 'medium',
      style: {
        color: '#000',
        fontSize: 24,
        textAlign: 'center',
        padding: 16,
        margin: 8
      }
    }
  },
  {
    type: 'text',
    name: 'Text',
    icon: 'FileText',
    defaultProps: {
      type: 'text',
      content: 'New text content',
      style: {
        color: '#333',
        fontSize: 16,
        textAlign: 'left',
        padding: 12,
        margin: 8
      }
    }
  },
  {
    type: 'image',
    name: 'Image',
    icon: 'Image',
    defaultProps: {
      type: 'image',
      source: 'https://picsum.photos/200/300',
      borderRadius: 8,
      style: {
        margin: 8,
        borderRadius: 8
      }
    }
  },
  {
    type: 'button',
    name: 'Button',
    icon: 'MousePointer',
    defaultProps: {
      type: 'button',
      content: 'Click Me',
      variant: 'primary',
      action: 'button_click',
      message: 'Button clicked!',
      style: {
        backgroundColor: '#007AFF',
        color: '#fff',
        padding: 12,
        margin: 8,
        borderRadius: 8
      }
    }
  },
  {
    type: 'gallery',
    name: 'Gallery',
    icon: 'Grid',
    defaultProps: {
      type: 'gallery',
      title: 'Image Gallery',
      titleSize: 'medium',
      titleColor: '#000',
      columns: 3,
      images: [
        {
          source: 'https://via.placeholder.com/100x100',
          size: 'small',
          shape: 'square'
        },
        {
          source: 'https://via.placeholder.com/100x100',
          size: 'small',
          shape: 'circle'
        },
        {
          source: 'https://via.placeholder.com/100x100',
          size: 'small',
          shape: 'rounded'
        }
      ],
      style: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        margin: 8,
        borderRadius: 8
      }
    }
  }
]; 