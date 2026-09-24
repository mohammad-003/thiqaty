import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, FAB, Card, Checkbox, useTheme, IconButton } from 'react-native-paper';
import { useTasks } from '@/db/repositories/useTasks';
import { format } from 'date-fns';
import { COLORS } from '@/constants/theme';

export default function TasksScreen({ navigation }: any) {
  const { tasks, toggleTaskDone, deleteTask } = useTasks();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: COLORS.grey }}>No tasks set.</Text>
            <Text variant="bodyMedium" style={{ color: COLORS.grey }}>Tap + to set a task with reminder.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.card} mode="elevated">
            <Card.Title 
              title={item.title} 
              subtitle={`Scheduled: ${format(item.dateTime, 'PPP p')}`}
              titleStyle={{
                textDecorationLine: item.done ? 'line-through' : 'none',
                color: item.done ? COLORS.grey : COLORS.text,
              }}
              left={() => (
                <Checkbox
                  status={item.done ? 'checked' : 'unchecked'}
                  onPress={() => toggleTaskDone(item.id)}
                  color={COLORS.primary}
                />
              )}
              right={() => (
                <IconButton
                  icon="trash-can-outline"
                  iconColor={COLORS.vaultAccent}
                  onPress={() => deleteTask(item.id)}
                />
              )}
            />
          </Card>
        )}
      />
      
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: COLORS.primary }]}
        color={COLORS.surface}
        onPress={() => navigation.navigate('TaskForm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, flexGrow: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
  card: { marginBottom: 12, backgroundColor: COLORS.surface },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
