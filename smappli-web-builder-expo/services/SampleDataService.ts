import { Block } from '../types/blocks';

/**
 * Service to load sample blocks data
 * Provides default blocks matching sample-blocks.json format
 */

export const sampleBlocks: Block[] = [
  {
    type: 'title',
    text: 'Smappli Application',
    size: 'large',
    color: '#fff',
    style: {
      backgroundColor: '#1a1f24',
      padding: 20,
      margin: 10,
      borderRadius: 10
    }
  },
  {
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
  },
  {
    type: 'image',
    source: '',
    borderRadius: 10,
    style: {
      padding: 0,
      margin: 10,
      borderRadius: 10
    }
  },
  {
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
  },
  {
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
];

/**
 * Load sample blocks data
 */
export const loadSampleBlocks = (): Block[] => {
  return sampleBlocks.map((block, index) => ({
    ...block,
    id: `sample_block_${index + 1}`
  }));
};

/**
 * Get a specific sample block by index
 */
export const getSampleBlock = (index: number): Block | null => {
  if (index < 0 || index >= sampleBlocks.length) {
    return null;
  }
  
  return {
    ...sampleBlocks[index],
    id: `sample_block_${index + 1}`
  };
};

/**
 * Get sample blocks by type
 */
export const getSampleBlocksByType = (type: string): Block[] => {
  return sampleBlocks
    .filter(block => block.type === type)
    .map((block, index) => ({
      ...block,
      id: `sample_${type}_${index + 1}`
    }));
}; 