import { ScrollView, StyleSheet, View } from 'react-native';

import BlockRenderer from '@/components/blocks/BlockRenderer';
import { ButtonItem } from '@/components/blocks/ButtonBlock';
import Title from '@/components/Title';
import { useBlocks } from '@/contexts/BlockContext';
import { showSimpleAlert } from '@/utils/alert';

export default function Index() {
  const { blocks, loading } = useBlocks();

  const handleButtonPress = (action: string, button: ButtonItem) => {
    switch (action) {
      case 'view_gallery':
        showSimpleAlert('Gallery', 'Opening image gallery...');
        break;
      case 'perform_action':
        showSimpleAlert('Action', 'Action performed successfully!');
        break;
      case 'interact_image':
        showSimpleAlert('Image', 'Interacting with image...');
        break;
      default:
        showSimpleAlert('Notice', button.message || `Pressed "${button.label}"`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Title text="Loading..." size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Block Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <BlockRenderer 
          blocks={blocks} 
          onButtonPress={handleButtonPress}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1a1f24',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 10,
  },
});
