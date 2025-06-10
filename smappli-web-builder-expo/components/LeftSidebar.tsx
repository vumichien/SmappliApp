import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBuilder } from '../contexts/BuilderContext';
import { blockTemplates, createBlockFromTemplate } from '../data/blockTemplates';

/**
 * Left sidebar component with block templates and categories
 * Allows users to add new blocks to the canvas
 */
const LeftSidebar: React.FC = () => {
  const { addBlock } = useBuilder();
  const [selectedCategory, setSelectedCategory] = useState<'basic' | 'media' | 'interactive'>('basic');

  const categories = [
    { id: 'basic', name: 'Basic', icon: '📝' },
    { id: 'media', name: 'Media', icon: '🖼️' },
    { id: 'interactive', name: 'Interactive', icon: '🔘' },
  ] as const;

  const filteredTemplates = blockTemplates.filter(template => template.category === selectedCategory);

  const handleAddBlock = (templateId: string) => {
    const newBlock = createBlockFromTemplate(templateId);
    if (newBlock) {
      addBlock(newBlock);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Components</Text>
      
      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === category.id && styles.categoryTabActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Templates List */}
      <ScrollView style={styles.templatesContainer} showsVerticalScrollIndicator={false}>
        {filteredTemplates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={styles.templateItem}
            onPress={() => handleAddBlock(template.id)}
          >
            <View style={styles.templatePreview}>
              <Text style={styles.templateIcon}>
                {getTemplateIcon(template.block.type)}
              </Text>
            </View>
            <View style={styles.templateInfo}>
              <Text style={styles.templateName}>{template.name}</Text>
              <Text style={styles.templateDescription}>{template.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to use:</Text>
        <Text style={styles.instructionsText}>
          • Tap on a component to add it to the canvas{'\n'}
          • Select blocks to edit their properties{'\n'}
          • Drag blocks to reorder them{'\n'}
          • Connect to mobile app to see live preview
        </Text>
      </View>
    </View>
  );
};

const getTemplateIcon = (type: string): string => {
  switch (type) {
    case 'title': return '📰';
    case 'text': return '📝';
    case 'image': return '🖼️';
    case 'button': return '🔘';
    case 'gallery': return '🖼️';
    default: return '❓';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRightWidth: 1,
    borderRightColor: '#E1E5E9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5E9',
    backgroundColor: '#FFFFFF',
  },
  categoryContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5E9',
  },
  categoryTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  categoryTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  templatesContainer: {
    flex: 1,
    padding: 12,
  },
  templateItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  templatePreview: {
    width: 40,
    height: 40,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  templateIcon: {
    fontSize: 20,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  templateDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  instructionsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E1E5E9',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
});

export default LeftSidebar; 