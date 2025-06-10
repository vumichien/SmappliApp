import React from 'react';
import ButtonBlock, { ButtonBlockData, ButtonItem } from './ButtonBlock';
import GalleryBlock, { GalleryBlockData } from './GalleryBlock';
import ImageBlock, { ImageBlockData } from './ImageBlock';
import TextBlock, { TextBlockData } from './TextBlock';
import TitleBlock, { TitleBlockData } from './TitleBlock';

export type BlockData = 
  | TitleBlockData 
  | TextBlockData 
  | ImageBlockData 
  | GalleryBlockData 
  | ButtonBlockData;

export interface BlockConfig {
  blocks: BlockData[];
}

interface Props {
  blocks: BlockData[];
  onButtonPress?: (action: string, button: ButtonItem) => void;
}

export default function BlockRenderer({ blocks, onButtonPress }: Props) {
  const renderBlock = (block: BlockData, index: number) => {
    switch (block.type) {
      case 'title':
        return <TitleBlock key={index} data={block} />;
      
      case 'text':
        return <TextBlock key={index} data={block} />;
      
      case 'image':
        return <ImageBlock key={index} data={block} />;
      
      case 'gallery':
        return <GalleryBlock key={index} data={block} />;
      
      case 'button':
        return <ButtonBlock key={index} data={block} onButtonPress={onButtonPress} />;
      
      default:
        return null;
    }
  };

  return (
    <>
      {blocks.map((block, index) => renderBlock(block, index))}
    </>
  );
} 