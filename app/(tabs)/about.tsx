import Title from '@/components/Title';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Title text="About Smappli" size="large" color="#ffd33d" />
        </View>

        {/* App Description */}
        <View style={styles.section}>
          <Title text="What is Smappli?" size="medium" color="#fff" />
          <Title 
            text="Smappli is a modern, flexible application. It allows users to create, manage, and display content through modular, reusable components."
            size="small" 
            color="#ccc" 
          />
        </View>

        {/* Use Cases */}
        <View style={styles.section}>
          <Title text="Use Cases" size="medium" color="#fff" />
          <Title 
            text="Perfect for content creators, developers, and businesses who need a flexible way to manage and display content. Ideal for portfolios, product showcases, documentation, marketing materials, and any application requiring dynamic content layouts."
            size="small" 
            color="#ccc" 
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Title text="© 2025 Smappli App - Detomo" size="small" color="#666" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  section: {
    marginBottom: 25,
    padding: 20,
    backgroundColor: '#2a2f35',
    borderRadius: 15,
  },
  featureItem: {
    marginTop: 15,
    paddingLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
});
