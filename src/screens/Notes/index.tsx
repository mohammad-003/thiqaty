import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Text, FAB, Card, Chip, useTheme, IconButton } from 'react-native-paper';
import { useNotes } from '@/db/repositories/useNotes';
import { NoteCategory } from '@/db/schemas';
import { format } from 'date-fns';
import { COLORS } from '@/constants/theme';

const CATEGORIES: ('All' | NoteCategory)[] = [
  'All',
  'Interview Prep',
  'Exam Prep',
  'Company',
  'Freelance',
  'Personal',
  'General',
];

export default function NotesScreen({ navigation }: any) {
  const { notes, deleteNote } = useNotes();
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<'All' | NoteCategory>('All');

  const filteredNotes = selectedCategory === 'All' 
    ? notes 
    : notes.filtered('category == $0', selectedCategory);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Category Filter Chips */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              selected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.chip,
                selectedCategory === cat && { backgroundColor: COLORS.primary }
              ]}
              textStyle={selectedCategory === cat ? { color: '#FFF' } : { color: COLORS.text }}
            >
              {cat}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: COLORS.grey }}>No notes found.</Text>
            <Text variant="bodyMedium" style={{ color: COLORS.grey }}>Tap + to create a note.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.card} mode="elevated" onPress={() => navigation.navigate('NoteForm', { id: item.id })}>
            <Card.Title 
              title={item.title} 
              subtitle={`${item.category} • ${format(item.createdAt, 'MMM dd, yyyy')}`}
              right={() => (
                <IconButton
                  icon="trash-can-outline"
                  iconColor={COLORS.vaultAccent}
                  onPress={() => deleteNote(item.id)}
                />
              )}
            />
            <Card.Content>
              <Text numberOfLines={3} style={styles.bodyPreview}>
                {item.body}
              </Text>
            </Card.Content>
          </Card>
        )}
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: COLORS.primary }]}
        color={COLORS.surface}
        onPress={() => navigation.navigate('NoteForm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterWrapper: { backgroundColor: COLORS.surface, elevation: 2 },
  filterContainer: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip: { marginRight: 4 },
  list: { padding: 16, flexGrow: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  card: { marginBottom: 12, backgroundColor: COLORS.surface },
  bodyPreview: { color: COLORS.text, opacity: 0.8, marginTop: 4 },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
