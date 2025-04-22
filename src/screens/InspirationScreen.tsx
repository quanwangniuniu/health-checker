import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

// Define types for inspiration items
interface InspirationItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  isFavorite: boolean;
  tags: string[];
  timestamp: string;
}

// Dummy data for inspiration items
const inspirationItems: InspirationItem[] = [
  {
    id: '1',
    title: 'Minimalist Design',
    description: 'A clean and simple design approach that focuses on essential elements and negative space.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    isFavorite: true,
    tags: ['design', 'minimalism', 'architecture'],
    timestamp: '2024-04-22',
  },
  {
    id: '2',
    title: 'Color Theory',
    description: 'Understanding how colors work together and their psychological impact on viewers.',
    image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721',
    isFavorite: false,
    tags: ['design', 'colors', 'psychology'],
    timestamp: '2024-04-21',
  },
  {
    id: '3',
    title: 'Typography Tips',
    description: 'Best practices for choosing and combining fonts to create effective visual hierarchy.',
    isFavorite: true,
    tags: ['design', 'typography', 'readability'],
    timestamp: '2024-04-20',
  },
];

const InspirationCard: React.FC<{ item: InspirationItem }> = ({ item }) => {
  return (
    <View style={styles.card}>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <TouchableOpacity>
            <Ionicons
              name={item.isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={item.isFavorite ? theme.colors.error : theme.colors.text}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
    </View>
  );
};

export default function InspirationScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inspiration Wall</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {inspirationItems.map((item) => (
          <InspirationCard key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
  },
  addButton: {
    padding: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    flex: 1,
  },
  cardDescription: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  tag: {
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  tagText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text,
  },
}); 