import React from 'react';
import { ButtonComponent, Component, GalleryComponent, ImageComponent, TextComponent, TitleComponent } from '../types/components';

interface ComponentPreviewProps {
  component: Component;
  isSelected?: boolean;
  onClick?: () => void;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ 
  component, 
  isSelected = false, 
  onClick 
}) => {
  const baseStyle: React.CSSProperties = {
    cursor: 'pointer',
    border: isSelected ? '2px solid #007AFF' : '1px solid transparent',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    position: 'relative',
    ...component.style
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'title':
        return <TitlePreview component={component as TitleComponent} />;
      case 'text':
        return <TextPreview component={component as TextComponent} />;
      case 'image':
        return <ImagePreview component={component as ImageComponent} />;
      case 'button':
        return <ButtonPreview component={component as ButtonComponent} />;
      case 'gallery':
        return <GalleryPreview component={component as GalleryComponent} />;
      default:
        return <div>Unknown component type: {component.type}</div>;
    }
  };

  return (
    <div style={baseStyle} onClick={onClick}>
      {renderComponent()}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: '#007AFF',
          color: 'white',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          ✓
        </div>
      )}
    </div>
  );
};

const TitlePreview: React.FC<{ component: TitleComponent }> = ({ component }) => {
  const fontSize = component.size === 'large' ? 28 : component.size === 'small' ? 18 : 24;
  
  return (
    <h1 style={{
      fontSize: `${fontSize}px`,
      color: component.style?.color || '#000',
      textAlign: component.style?.textAlign as any || 'center',
      margin: 0,
      padding: `${component.style?.padding || 16}px`,
      fontWeight: 'bold'
    }}>
      {component.content}
    </h1>
  );
};

const TextPreview: React.FC<{ component: TextComponent }> = ({ component }) => {
  return (
    <p style={{
      fontSize: `${component.style?.fontSize || 16}px`,
      color: component.style?.color || '#333',
      textAlign: component.style?.textAlign as any || 'left',
      margin: 0,
      padding: `${component.style?.padding || 12}px`,
      lineHeight: 1.5
    }}>
      {component.content}
    </p>
  );
};

const ImagePreview: React.FC<{ component: ImageComponent }> = ({ component }) => {
  return (
    <div style={{ 
      padding: `${component.style?.padding || 0}px`,
      textAlign: 'center'
    }}>
      <img
        src={component.source}
        alt="Preview"
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: `${component.borderRadius || 0}px`,
          display: 'block',
          margin: '0 auto'
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://picsum.photos/200/300?text=Image+Not+Found';
        }}
      />
    </div>
  );
};

const ButtonPreview: React.FC<{ component: ButtonComponent }> = ({ component }) => {
  const isPrimary = component.variant === 'primary';
  
  return (
    <div style={{ 
      padding: `${component.style?.padding || 12}px`,
      textAlign: 'center'
    }}>
      <button
        style={{
          backgroundColor: isPrimary ? '#007AFF' : '#f0f0f0',
          color: isPrimary ? '#fff' : '#333',
          border: 'none',
          borderRadius: `${component.style?.borderRadius || 8}px`,
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          ...component.style
        }}
        onClick={(e) => {
          e.stopPropagation();
          alert(component.message || 'Button clicked!');
        }}
      >
        {component.content}
      </button>
    </div>
  );
};

const GalleryPreview: React.FC<{ component: GalleryComponent }> = ({ component }) => {
  const columns = component.columns || 3;
  
  return (
    <div style={{ 
      padding: `${component.style?.padding || 16}px`
    }}>
      {component.title && (
        <h3 style={{
          fontSize: component.titleSize === 'large' ? '24px' : component.titleSize === 'small' ? '16px' : '20px',
          color: component.titleColor || '#000',
          margin: '0 0 16px 0',
          textAlign: 'center'
        }}>
          {component.title}
        </h3>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '8px'
      }}>
        {component.images.map((image, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <img
              src={image.source}
              alt={`Gallery ${index + 1}`}
              style={{
                width: '100%',
                height: '80px',
                objectFit: 'cover',
                borderRadius: image.shape === 'circle' ? '50%' : 
                           image.shape === 'rounded' ? '8px' : '0px'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentPreview; 