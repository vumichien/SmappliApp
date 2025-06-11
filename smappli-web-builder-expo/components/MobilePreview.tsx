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
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabel}>Home</Text>
          </View>
          <View style={styles.navItem}>
            <Text style={styles.navIcon}>🔧</Text>
            <Text style={styles.navLabel}>Build</Text>
          </View>
          <View style={styles.navItem}>
            <Text style={styles.navIcon}>ℹ️</Text>
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
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  phoneFrame: {
    width: 320,
    height: 640,
    backgroundColor: '#000000',
    borderRadius: 32,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  statusBar: {
    height: 36,
    backgroundColor: '#25292e',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusIcons: {
    flexDirection: 'row',
  },
  appHeader: {
    height: 50,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f24',
  },
  appTitle: {
    fontSize: 12, // Scaled down from 16 for responsive design
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
    paddingVertical: 20,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16, // Scaled down from 20 for responsive design
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 11, // Scaled down from 14 for responsive design
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 16, // Scaled down from 20 for responsive design
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  emptyImagePlaceholder: {
    width: 220,
    height: 120,
    backgroundColor: '#1a1f24',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyImageText: {
    fontSize: 48,
  },
  emptySubtitle: {
    fontSize: 12, // Scaled down from 16 for responsive design
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  emptyGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  emptyGalleryItem: {
    width: 60,
    height: 60,
    backgroundColor: '#1a1f24',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyGalleryIcon: {
    fontSize: 24,
  },
  bottomNav: {
    height: 50,
    backgroundColor: '#1a1f24',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 3,
  },
  navLabel: {
    fontSize: 7, // Scaled down from 9 for responsive design
    color: '#FFFFFF',
    fontWeight: '500',
  },
  homeIndicator: {
    width: 120,
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});

export default MobilePreview; 