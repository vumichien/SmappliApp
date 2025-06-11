import { BlockTemplate } from '../types/blocks';

/**
 * Pre-defined block templates for the web builder
 * Updated to match sample-blocks.json format
 */

export const blockTemplates: BlockTemplate[] = [
  // Basic Templates
  {
    id: 'title-basic',
    name: 'Title',
    description: 'Basic title block',
    category: 'basic',
    block: {
      type: 'title',
      text: 'Smappli Application',
      size: 'large',
      color: '#fff',
      style: {
        backgroundColor: '#1a1f24',
        padding: 20,
        margin: 10,
        borderRadius: 10,
        textAlign: 'center'
      }
    }
  },
  {
    id: 'text-basic',
    name: 'Text',
    description: 'Basic text block',
    category: 'basic',
    block: {
      type: 'text',
      content: 'Welcome to Smappli - where you can explore and interact with diverse content through a flexible block system.',
      fontSize: 16,
      color: '#ccc',
      textAlign: 'center',
      style: {
        backgroundColor: '#2a2f35',
        padding: 15,
        margin: 10,
        borderRadius: 10
      }
    }
  },
  
  // Media Templates
  {
    id: 'image-basic',
    name: 'Image',
    description: 'Basic image block',
    category: 'media',
    block: {
      type: 'image',
      source: '',
      borderRadius: 10,
      style: {
        padding: 0,
        margin: 10,
        borderRadius: 10
      }
    }
  },
  {
    id: 'gallery-basic',
    name: 'Gallery',
    description: 'Image gallery block',
    category: 'media',
    block: {
      type: 'gallery',
      title: 'Image Gallery',
      titleSize: 'medium',
      titleColor: '#fff',
      columns: 3,
      images: [
        {
          source: 'https://via.placeholder.com/150x150',
          size: 'small',
          shape: 'circle'
        },
        {
          source: 'https://via.placeholder.com/150x150',
          size: 'small',
          shape: 'square'
        },
        {
          source: 'https://via.placeholder.com/150x150',
          size: 'small',
          shape: 'rounded'
        },
        {
          source: 'https://via.placeholder.com/150x150',
          size: 'small',
          shape: 'circle'
        },
        {
          source: 'https://via.placeholder.com/150x150',
          size: 'small',
          shape: 'square'
        },
        {
          source: 'https://via.placeholder.com/150x150',
          size: 'small',
          shape: 'rounded'
        }
      ],
      style: {
        backgroundColor: '#2a2f35',
        padding: 0,
        margin: 10,
        borderRadius: 10
      }
    }
  },
  
  // Interactive Templates
  {
    id: 'button-single',
    name: 'Single Button',
    description: 'Single button block',
    category: 'interactive',
    block: {
      type: 'button',
      title: 'Choose Action',
      titleSize: 'medium',
      titleColor: '#fff',
      buttons: [
        {
          label: 'View Gallery',
          variant: 'primary',
          action: 'view_gallery',
          message: 'Opening gallery...'
        }
      ],
      style: {
        backgroundColor: '#2a2f35',
        padding: 0,
        margin: 10,
        borderRadius: 10
      }
    }
  },
  {
    id: 'button-multiple',
    name: 'Multiple Buttons',
    description: 'Multiple buttons block',
    category: 'interactive',
    block: {
      type: 'button',
      title: 'Choose Action',
      titleSize: 'medium',
      titleColor: '#fff',
      buttons: [
        {
          label: 'View Gallery',
          variant: 'primary',
          action: 'view_gallery',
          message: 'Opening gallery...'
        },
        {
          label: 'Perform Action',
          variant: 'secondary',
          action: 'perform_action',
          message: 'Action performed successfully!'
        },
        {
          label: 'Interact with Image',
          variant: 'secondary',
          action: 'interact_image',
          message: 'Interacting with image...'
        }
      ],
      style: {
        backgroundColor: '#2a2f35',
        padding: 0,
        margin: 10,
        borderRadius: 10
      }
    }
  }
];

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category: 'basic' | 'media' | 'interactive') => {
  return blockTemplates.filter(template => template.category === category);
};

/**
 * Get template by ID
 */
export const getTemplateById = (id: string) => {
  return blockTemplates.find(template => template.id === id);
};

/**
 * Create a new block from template
 */
export const createBlockFromTemplate = (templateId: string): any => {
  const template = getTemplateById(templateId);
  if (!template) return null;
  
  return {
    ...template.block,
    // Generate unique ID for the new block
    id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
}; 