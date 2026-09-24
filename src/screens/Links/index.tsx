import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Linking, Clipboard } from 'react-native';
import { Text, FAB, Card, Searchbar, useTheme, IconButton, Avatar } from 'react-native-paper';
import { useLinksContacts } from '@/db/repositories/useLinksContacts';
import { COLORS } from '@/constants/theme';

export default function LinksScreen({ navigation }: any) {
  const { items, deleteItem } = useLinksContacts();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = searchQuery
    ? items.filtered('label CONTAINS[c] $0 OR value CONTAINS[c] $0', searchQuery)
    : items;

  const handleAction = (type: 'email' | 'phone' | 'link', value: string) => {
    if (type === 'link') {
      const url = value.startsWith('http') ? value : `https://${value}`;
      Linking.openURL(url).catch(() => {});
    } else if (type === 'phone') {
      Linking.openURL(`tel:${value}`).catch(() => {});
    } else if (type === 'email') {
      Linking.openURL(`mailto:${value}`).catch(() => {});
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return 'email-outline';
      case 'phone': return 'phone-outline';
      case 'link': return 'link-variant';
      default: return 'bookmark-outline';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search links, emails, contacts..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: COLORS.grey }}>No contacts or links saved.</Text>
            <Text variant="bodyMedium" style={{ color: COLORS.grey }}>Tap + to save an email, phone, or URL.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card 
            style={styles.card} 
            mode="elevated"
            onPress={() => handleAction(item.type as any, item.value)}
          >
            <Card.Title 
              title={item.label} 
              subtitle={item.value}
              left={(props) => (
                <Avatar.Icon 
                  {...props} 
                  icon={getIcon(item.type)} 
                  style={{ backgroundColor: COLORS.primary }} 
                />
              )}
              right={() => (
                <IconButton
                  icon="trash-can-outline"
                  iconColor={COLORS.vaultAccent}
                  onPress={() => deleteItem(item.id)}
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
        onPress={() => navigation.navigate('LinkContactForm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: { margin: 16, backgroundColor: COLORS.surface },
  list: { paddingHorizontal: 16, paddingBottom: 80, flexGrow: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  card: { marginBottom: 10, backgroundColor: COLORS.surface },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
