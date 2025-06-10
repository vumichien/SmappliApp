import React from 'react';
import { useBuilder } from '../contexts/BuilderContext';
import ComponentPreview from './ComponentPreview';

const MobilePreview: React.FC = () => {
  const { components, selectedComponentId, selectComponent } = useBuilder();

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '40px 20px',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh'
    }}>
      {/* Mobile Frame */}
      <div style={{
        width: '375px',
        minHeight: '667px',
        backgroundColor: '#000',
        borderRadius: '30px',
        padding: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        {/* Status Bar */}
        <div style={{
          height: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          <div>9:41</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <div style={{ width: '18px', height: '10px', border: '1px solid #fff', borderRadius: '2px' }}>
              <div style={{ width: '14px', height: '6px', backgroundColor: '#fff', borderRadius: '1px', margin: '1px' }}></div>
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          minHeight: '580px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#007AFF',
            color: '#fff',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Smappli Preview
          </div>

          {/* Content Area */}
          <div style={{
            padding: '0',
            minHeight: '500px',
            overflow: 'auto'
          }}>
            {components.length === 0 ? (
              <EmptyState />
            ) : (
              <div>
                {components.map((component) => (
                  <ComponentPreview
                    key={component.id}
                    component={component}
                    isSelected={selectedComponentId === component.id}
                    onClick={() => selectComponent(component.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Home Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '134px',
          height: '5px',
          backgroundColor: '#fff',
          borderRadius: '3px',
          opacity: 0.7
        }}></div>
      </div>

      {/* Device Info */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontSize: '12px',
        color: '#666'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>iPhone 12 Pro</div>
        <div>375 × 667 px</div>
        <div>{components.length} components</div>
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      color: '#666',
      textAlign: 'center',
      padding: '40px'
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '24px',
        opacity: 0.5
      }}>
        📱
      </div>
      <h3 style={{
        margin: '0 0 12px 0',
        fontSize: '20px',
        fontWeight: '600',
        color: '#333'
      }}>
        Start Building Your App
      </h3>
      <p style={{
        margin: '0 0 24px 0',
        fontSize: '16px',
        lineHeight: 1.5,
        maxWidth: '280px'
      }}>
        Add components from the left sidebar to see them appear here in real-time
      </p>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '14px',
        color: '#888'
      }}>
        <div>1. Choose "Add New" tab on the left</div>
        <div>2. Click on any component to add it</div>
        <div>3. Customize it in the right panel</div>
        <div>4. Click "Build" to send to mobile app</div>
      </div>
    </div>
  );
};

export default MobilePreview; 