import { List, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useBuilder } from '../contexts/BuilderContext';
import { componentTemplates } from '../data/componentTemplates';
import { Component } from '../types/components';

const LeftSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'components' | 'templates'>('components');
  const { 
    components, 
    selectedComponentId, 
    selectComponent, 
    removeComponent, 
    addComponent 
  } = useBuilder();

  const handleAddComponent = (template: any) => {
    const newComponent: Component = {
      ...template.defaultProps,
      id: `${template.type}_${Date.now()}`
    } as Component;
    
    addComponent(newComponent);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Type': return '📝';
      case 'FileText': return '📄';
      case 'Image': return '🖼️';
      case 'MousePointer': return '🔘';
      case 'Grid': return '🔲';
      default: return '📦';
    }
  };

  return (
    <div style={{
      width: '300px',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid #e9ecef',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e9ecef',
        backgroundColor: '#fff'
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '18px', 
          fontWeight: '600',
          color: '#333'
        }}>
          Components
        </h2>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e9ecef'
      }}>
        <button
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            backgroundColor: activeTab === 'components' ? '#007AFF' : 'transparent',
            color: activeTab === 'components' ? '#fff' : '#666',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
          onClick={() => setActiveTab('components')}
        >
          <List size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Current ({components.length})
        </button>
        <button
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            backgroundColor: activeTab === 'templates' ? '#007AFF' : 'transparent',
            color: activeTab === 'templates' ? '#fff' : '#666',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
          onClick={() => setActiveTab('templates')}
        >
          <Plus size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Add New
        </button>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px'
      }}>
        {activeTab === 'components' ? (
          <ComponentList 
            components={components}
            selectedComponentId={selectedComponentId}
            onSelectComponent={selectComponent}
            onRemoveComponent={removeComponent}
          />
        ) : (
          <TemplateList 
            templates={componentTemplates}
            onAddComponent={handleAddComponent}
            getIconComponent={getIconComponent}
          />
        )}
      </div>
    </div>
  );
};

interface ComponentListProps {
  components: Component[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string) => void;
  onRemoveComponent: (id: string) => void;
}

const ComponentList: React.FC<ComponentListProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  onRemoveComponent
}) => {
  if (components.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
        marginTop: '40px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
        <p>No components added yet</p>
        <p>Switch to "Add New" tab to start building</p>
      </div>
    );
  }

  return (
    <div>
      {components.map((component, index) => (
        <div
          key={component.id}
          style={{
            padding: '12px',
            marginBottom: '8px',
            backgroundColor: selectedComponentId === component.id ? '#e3f2fd' : '#fff',
            border: selectedComponentId === component.id ? '2px solid #007AFF' : '1px solid #e9ecef',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onClick={() => onSelectComponent(component.id)}
        >
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '4px'
            }}>
              {index + 1}. {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {getComponentPreviewText(component)}
            </div>
          </div>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#dc3545',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveComponent(component.id);
            }}
            title="Remove component"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

interface TemplateListProps {
  templates: any[];
  onAddComponent: (template: any) => void;
  getIconComponent: (iconName: string) => string;
}

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onAddComponent,
  getIconComponent
}) => {
  return (
    <div>
      <div style={{
        fontSize: '14px',
        color: '#666',
        marginBottom: '16px'
      }}>
        Click on any component to add it to your design
      </div>
      
      {templates.map((template) => (
        <div
          key={template.type}
          style={{
            padding: '16px',
            marginBottom: '12px',
            backgroundColor: '#fff',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={() => onAddComponent(template)}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#007AFF';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e9ecef';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            fontSize: '24px',
            marginRight: '12px'
          }}>
            {getIconComponent(template.icon)}
          </div>
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '4px'
            }}>
              {template.name}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666'
            }}>
              Add a {template.name.toLowerCase()} component
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const getComponentPreviewText = (component: Component): string => {
  switch (component.type) {
    case 'title':
    case 'text':
    case 'button':
      return component.content || 'No content';
    case 'image':
      return component.source || 'No image source';
    case 'gallery':
      return `${component.images?.length || 0} images`;
    default:
      return 'Component';
  }
};

export default LeftSidebar; 