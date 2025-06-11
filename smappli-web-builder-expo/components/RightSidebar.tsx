import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBuilder } from '../contexts/BuilderContext';
import { Block, ButtonBlock, GalleryBlock, ImageBlock, TextBlock, TitleBlock } from '../types/blocks';
import ImageUploader from './ImageUploader';

/**
 * Right sidebar component focused on block properties
 * With collapsible connection settings and localStorage status
 */
const RightSidebar: React.FC = () => {
  const { state, updateBlock, removeBlock, connect, disconnect, resetToSample } = useBuilder();
  const [isConnectionExpanded, setIsConnectionExpanded] = useState(false);

  const selectedBlock = state.blocks.find(block => block.id === state.selectedBlockId);
  
  // Debug logging for selectedBlock
  useEffect(() => {
    console.log('🎯 RightSidebar: selectedBlock changed:', {
      id: selectedBlock?.id,
      type: selectedBlock?.type,
      source: selectedBlock?.type === 'image' ? (selectedBlock.source ? selectedBlock.source.substring(0, 50) + '...' : 'empty') : 'N/A'
    });
  }, [selectedBlock]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to sample data? This will clear your current work.')) {
      resetToSample();
    }
  };

  const getLastSaveInfo = () => {
    try {
      const lastSave = localStorage.getItem('smappli_last_save');
      if (lastSave) {
        const date = new Date(lastSave);
        return date.toLocaleString();
      }
    } catch (error) {
      console.error('Error getting last save info:', error);
    }
    return 'Never';
  };

  const handleRemoveBlock = () => {
    if (selectedBlock) {
      removeBlock(selectedBlock.id!);
    }
  };

  const updateBlockProperty = (property: string, value: any) => {
    if (!selectedBlock) return;
    
    console.log(`🔧 Updating block property: ${property} =`, typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value);
    console.log(`📋 Current block before update:`, selectedBlock);
    
    const updatedBlock = { ...selectedBlock, [property]: value };
    console.log(`📋 Updated block after property change:`, updatedBlock);
    
    updateBlock(updatedBlock);
  };

  const updateBlockStyle = (styleProperty: string, value: any) => {
    if (!selectedBlock) return;
    
    const updatedBlock = {
      ...selectedBlock,
      style: {
        ...selectedBlock.style,
        [styleProperty]: value
      }
    };
    updateBlock(updatedBlock);
  };

  return (
    <View style={styles.container}>
      {/* Connection Tab */}
      <View style={styles.connectionTab}>
        <TouchableOpacity
          style={styles.connectionHeader}
          onPress={() => setIsConnectionExpanded(!isConnectionExpanded)}
        >
          <View style={styles.connectionStatus}>
            <View style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(state.connectionStatus) }
            ]} />
            <Text style={styles.connectionTitle}>Connection</Text>
          </View>
          <Text style={styles.expandIcon}>
            {isConnectionExpanded ? '▼' : '▶'}
          </Text>
        </TouchableOpacity>

        {isConnectionExpanded && (
          <View style={styles.connectionContent}>
            <TouchableOpacity
              style={[
                styles.connectionButton,
                state.isConnected ? styles.buttonDisconnect : styles.buttonConnect
              ]}
              onPress={state.isConnected ? disconnect : handleConnect}
            >
              <Text style={styles.connectionButtonText}>
                {state.isConnected ? 'Disconnect' : 'Connect'}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.connectionInfo}>
              {getStatusText(state.connectionStatus)}
            </Text>
            
            <Text style={styles.urlText}>ws://localhost:8081/ws</Text>
            
            <View style={styles.dividerSmall} />
            
            <Text style={styles.storageTitle}>Local Storage</Text>
            <Text style={styles.storageInfo}>
              Blocks: {state.blocks.length} | Last saved: {getLastSaveInfo()}
            </Text>
            
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>🔄 Reset to Sample</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Properties Panel */}
      <ScrollView style={styles.propertiesContainer} showsVerticalScrollIndicator={false}>
        {selectedBlock ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Block Properties</Text>
            
            {/* Block Type Info */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>{selectedBlock.type}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID:</Text>
              <Text style={styles.infoValue}>{selectedBlock.id}</Text>
            </View>

            <View style={styles.divider} />

            {/* Type-specific properties */}
            {renderBlockProperties(selectedBlock, updateBlockProperty)}

            {/* Style Properties */}
            <Text style={styles.subsectionTitle}>Style Properties</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Background Color:</Text>
              <TextInput
                style={styles.input}
                value={selectedBlock.style?.backgroundColor || ''}
                onChangeText={(value) => updateBlockStyle('backgroundColor', value)}
                placeholder="#1a1f24"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Padding:</Text>
              <TextInput
                style={styles.input}
                value={selectedBlock.style?.padding?.toString() || ''}
                onChangeText={(value) => updateBlockStyle('padding', parseInt(value) || 0)}
                placeholder="16"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Margin:</Text>
              <TextInput
                style={styles.input}
                value={selectedBlock.style?.margin?.toString() || ''}
                onChangeText={(value) => updateBlockStyle('margin', parseInt(value) || 0)}
                placeholder="8"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Border Radius:</Text>
              <TextInput
                style={styles.input}
                value={selectedBlock.style?.borderRadius?.toString() || ''}
                onChangeText={(value) => updateBlockStyle('borderRadius', parseInt(value) || 0)}
                placeholder="8"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Text Align:</Text>
              <View style={styles.segmentedControl}>
                {['left', 'center', 'right'].map((align) => (
                  <TouchableOpacity
                    key={align}
                    style={[
                      styles.segmentButton,
                      selectedBlock.style?.textAlign === align && styles.segmentButtonActive
                    ]}
                    onPress={() => updateBlockStyle('textAlign', align)}
                  >
                    <Text style={[
                      styles.segmentText,
                      selectedBlock.style?.textAlign === align && styles.segmentTextActive
                    ]}>
                      {align}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            {/* Remove Block Button */}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemoveBlock}
            >
              <Text style={styles.removeButtonText}>🗑️ Remove Block</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>No Block Selected</Text>
            <Text style={styles.emptyText}>
              Select a block from the preview to edit its properties
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const renderBlockProperties = (block: Block, updateProperty: (property: string, value: any) => void) => {
  switch (block.type) {
    case 'title':
      const titleBlock = block as TitleBlock;
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Text:</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={titleBlock.text}
              onChangeText={(value) => updateProperty('text', value)}
              placeholder="Enter title text"
              placeholderTextColor="#999"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Size:</Text>
            <View style={styles.segmentedControl}>
              {['small', 'medium', 'large'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.segmentButton,
                    titleBlock.size === size && styles.segmentButtonActive
                  ]}
                  onPress={() => updateProperty('size', size)}
                >
                  <Text style={[
                    styles.segmentText,
                    titleBlock.size === size && styles.segmentTextActive
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Color:</Text>
            <TextInput
              style={styles.input}
              value={titleBlock.color || ''}
              onChangeText={(value) => updateProperty('color', value)}
              placeholder="#FFFFFF"
              placeholderTextColor="#999"
            />
          </View>
        </>
      );

    case 'text':
      const textBlock = block as TextBlock;
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Content:</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={textBlock.content}
              onChangeText={(value) => updateProperty('content', value)}
              placeholder="Enter text content"
              placeholderTextColor="#999"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Font Size:</Text>
            <TextInput
              style={styles.input}
              value={textBlock.fontSize?.toString() || ''}
              onChangeText={(value) => updateProperty('fontSize', parseInt(value) || 16)}
              placeholder="16"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Color:</Text>
            <TextInput
              style={styles.input}
              value={textBlock.color || ''}
              onChangeText={(value) => updateProperty('color', value)}
              placeholder="#B0B0B0"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Text Align:</Text>
            <View style={styles.segmentedControl}>
              {['left', 'center', 'right'].map((align) => (
                <TouchableOpacity
                  key={align}
                  style={[
                    styles.segmentButton,
                    textBlock.textAlign === align && styles.segmentButtonActive
                  ]}
                  onPress={() => updateProperty('textAlign', align)}
                >
                  <Text style={[
                    styles.segmentText,
                    textBlock.textAlign === align && styles.segmentTextActive
                  ]}>
                    {align}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      );

    case 'image':
      const imageBlock = block as ImageBlock;
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image:</Text>
            <ImageUploader
              currentImageUrl={imageBlock.source}
              onImageUploaded={(imageData) => {
                console.log('🖼️ Image uploaded in RightSidebar:', imageData.id);
                console.log('📷 Image data:', {
                  id: imageData.id,
                  filename: imageData.filename,
                  base64Length: imageData.base64.length
                });
                
                // Create data URL for immediate preview and replace current image
                const dataUrl = `data:image/jpeg;base64,${imageData.base64}`;
                console.log('📷 Setting image source to data URL (length:', dataUrl.length, ')');
                console.log('📋 Current block before update:', {
                  id: imageBlock.id,
                  type: imageBlock.type,
                  currentSource: imageBlock.source ? imageBlock.source.substring(0, 50) + '...' : 'empty'
                });
                
                // Update both source and imageId properties
                updateProperty('source', dataUrl);
                updateProperty('imageId', imageData.id);
                
                console.log('✅ Image properties updated - triggering re-render');
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Border Radius:</Text>
            <TextInput
              style={styles.input}
              value={imageBlock.borderRadius?.toString() || ''}
              onChangeText={(value) => updateProperty('borderRadius', parseInt(value) || 0)}
              placeholder="10"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </>
      );

    case 'button':
      const buttonBlock = block as ButtonBlock;
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
              style={styles.input}
              value={buttonBlock.title || ''}
              onChangeText={(value) => updateProperty('title', value)}
              placeholder="Button Section Title"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title Size:</Text>
            <View style={styles.segmentedControl}>
              {['small', 'medium', 'large'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.segmentButton,
                    buttonBlock.titleSize === size && styles.segmentButtonActive
                  ]}
                  onPress={() => updateProperty('titleSize', size)}
                >
                  <Text style={[
                    styles.segmentText,
                    buttonBlock.titleSize === size && styles.segmentTextActive
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title Color:</Text>
            <TextInput
              style={styles.input}
              value={buttonBlock.titleColor || ''}
              onChangeText={(value) => updateProperty('titleColor', value)}
              placeholder="#FFFFFF"
              placeholderTextColor="#999"
            />
          </View>

          <Text style={styles.subsectionTitle}>Buttons ({buttonBlock.buttons.length})</Text>
          <Text style={styles.helpText}>Button editing coming soon...</Text>
        </>
      );

    case 'gallery':
      const galleryBlock = block as GalleryBlock;
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
              style={styles.input}
              value={galleryBlock.title || ''}
              onChangeText={(value) => updateProperty('title', value)}
              placeholder="Gallery Title"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title Size:</Text>
            <View style={styles.segmentedControl}>
              {['small', 'medium', 'large'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.segmentButton,
                    galleryBlock.titleSize === size && styles.segmentButtonActive
                  ]}
                  onPress={() => updateProperty('titleSize', size)}
                >
                  <Text style={[
                    styles.segmentText,
                    galleryBlock.titleSize === size && styles.segmentTextActive
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title Color:</Text>
            <TextInput
              style={styles.input}
              value={galleryBlock.titleColor || ''}
              onChangeText={(value) => updateProperty('titleColor', value)}
              placeholder="#FFFFFF"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Columns:</Text>
            <TextInput
              style={styles.input}
              value={galleryBlock.columns?.toString() || ''}
              onChangeText={(value) => updateProperty('columns', parseInt(value) || 3)}
              placeholder="3"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.subsectionTitle}>Images ({galleryBlock.images.length})</Text>
          <Text style={styles.helpText}>Image editing coming soon...</Text>
        </>
      );

    default:
      return null;
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'connected': return '#34C759';
    case 'connecting': return '#FF9500';
    case 'error': return '#FF3B30';
    default: return '#8E8E93';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'connected': return 'Connected to mobile app';
    case 'connecting': return 'Connecting...';
    case 'error': return 'Connection failed';
    default: return 'Not connected';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  connectionTab: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5E9',
  },
  connectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  expandIcon: {
    fontSize: 12,
    color: '#666666',
  },
  connectionContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  connectionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonConnect: {
    backgroundColor: '#34C759',
  },
  buttonDisconnect: {
    backgroundColor: '#FF3B30',
  },
  connectionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  connectionInfo: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 4,
  },
  urlText: {
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  propertiesContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E5E9',
    marginVertical: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 2,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: '#007AFF',
  },
  segmentText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  dividerSmall: {
    height: 1,
    backgroundColor: '#E1E5E9',
    marginVertical: 8,
  },
  storageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  storageInfo: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  resetButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default RightSidebar; 