import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useBuilder } from '../contexts/BuilderContext';
import BlockPreview from './BlockPreview';

/**
 * Mobile preview component that simulates the actual Smappli mobile app interface
 * Shows how blocks will appear on mobile device with dark theme
 */
const MobilePreview: React.FC = () => {
  const { state, selectBlock, connect } = useBuilder();

  // Auto-connect to WebSocket when component mounts
  useEffect(() => {
    if (state.connectionStatus === 'disconnected') {
      connect();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile Preview</Text>
      
      {/* iPhone Frame */}
      <View style={styles.phoneFrame}>
        {/* Status Bar */}
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>9:41</Text>
          <View style={styles.statusIcons}>
            <Text style={styles.statusText}>📶 📶 🔋</Text>
          </View>
        </View>

        {/* App Header - Dark Theme */}
        <View style={styles.appHeader}>
          <Text style={styles.appTitle}>Home</Text>
        </View>

        {/* Content Area - Dark Theme matching main app */}
        <ScrollView 
          style={styles.contentArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {state.blocks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📱</Text>
              <Text style={styles.emptyTitle}>Welcome to Smappli</Text>
              <Text style={styles.emptyDescription}>
                where you can explore and interact with diverse content through a flexible block system.
              </Text>
              <View style={styles.emptyImagePlaceholder}>
                <Text style={styles.emptyImageText}>🏝️</Text>
              </View>
              <Text style={styles.emptySubtitle}>Image Gallery</Text>
              <View style={styles.emptyGallery}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <View key={item} style={styles.emptyGalleryItem}>
                    <Text style={styles.emptyGalleryIcon}>🏝️</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            state.blocks.map((block, index) => (
              <View key={block.id} style={styles.blockWrapper}>
                <BlockPreview
                  block={block}
                  isSelected={state.selectedBlockId === block.id}
                  onPress={() => selectBlock(block.id || '')}
                />
              </View>
            ))
          )}
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <View style={styles.navItem}>
            <Ionicons name="home-sharp" color="#FFFFFF" size={14} />
            <Text style={styles.navLabel}>Home</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="construct" color="#FFFFFF" size={14} />
            <Text style={styles.navLabel}>Build</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="information-circle" color="#FFFFFF" size={14} />
            <Text style={styles.navLabel}>About</Text>
          </View>
        </View>

        {/* Home Indicator */}
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  phoneFrame: {
    width: 280,
    height: 580,
    backgroundColor: '#000000',
    borderRadius: 28,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  statusBar: {
    height: 28,
    backgroundColor: '#25292e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusIcons: {
    flexDirection: 'row',
  },
  appHeader: {
    height: 40,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f24',
  },
  appTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  contentContainer: {
    padding: 0,
    minHeight: '100%',
  },
  blockWrapper: {
    marginBottom: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  emptyIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 9,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  emptyImagePlaceholder: {
    width: 180,
    height: 100,
    backgroundColor: '#1a1f24',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyImageText: {
    fontSize: 36,
  },
  emptySubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  emptyGalleryItem: {
    width: 45,
    height: 45,
    backgroundColor: '#1a1f24',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyGalleryIcon: {
    fontSize: 18,
  },
  bottomNav: {
    height: 42,
    backgroundColor: '#1a1f24',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 6,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: 2,
  },
  homeIndicator: {
    width: 100,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
});

export default MobilePreview; 