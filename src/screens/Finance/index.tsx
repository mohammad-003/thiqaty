import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, SegmentedButtons, useTheme, IconButton } from 'react-native-paper';
import { useFinance } from '@/db/repositories/useFinance';
import { format } from 'date-fns';
import { COLORS } from '@/constants/theme';

export default function FinanceScreen({ navigation }: any) {
  const { entries, deleteEntry } = useFinance();
  const theme = useTheme();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filteredEntries = filterType === 'all' 
    ? entries 
    : entries.filtered('type == $0', filterType);

  const totalIncome = entries.filtered('type == "income"').sum('amount') || 0;
  const totalExpense = entries.filtered('type == "expense"').sum('amount') || 0;
  const netBalance = totalIncome - totalExpense;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Financial Summary Card */}
      <Card style={styles.summaryCard} mode="elevated">
        <Card.Content style={styles.summaryContent}>
          <View style={styles.summaryItem}>
            <Text variant="labelMedium" style={styles.summaryLabel}>Total Income</Text>
            <Text variant="titleMedium" style={{ color: COLORS.success, fontWeight: 'bold' }}>
              +${totalIncome.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text variant="labelMedium" style={styles.summaryLabel}>Total Expenses</Text>
            <Text variant="titleMedium" style={{ color: COLORS.vaultAccent, fontWeight: 'bold' }}>
              -${totalExpense.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text variant="labelMedium" style={styles.summaryLabel}>Net Balance</Text>
            <Text variant="titleMedium" style={{ color: netBalance >= 0 ? COLORS.primary : COLORS.vaultAccent, fontWeight: 'bold' }}>
              ${netBalance.toFixed(2)}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Filter Segmented Control */}
      <View style={styles.filterWrapper}>
        <SegmentedButtons
          value={filterType}
          onValueChange={(val: any) => setFilterType(val)}
          buttons={[
            { value: 'all', label: 'All Transactions' },
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expenses' },
          ]}
          style={styles.segmented}
        />
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: COLORS.grey }}>No transactions logged.</Text>
            <Text variant="bodyMedium" style={{ color: COLORS.grey }}>Tap + to log income or expense.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.card} mode="elevated">
            <Card.Title 
              title={item.category} 
              subtitle={`${format(item.date, 'PPP')} ${item.note ? `• ${item.note}` : ''}`}
              left={(props) => (
                <Text style={[styles.typeIcon, { color: item.type === 'income' ? COLORS.success : COLORS.vaultAccent }]}>
                  {item.type === 'income' ? '+' : '-'}
                </Text>
              )}
              right={() => (
                <View style={styles.rightContainer}>
                  <Text style={[styles.amountText, { color: item.type === 'income' ? COLORS.success : COLORS.vaultAccent }]}>
                    {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
                  </Text>
                  <IconButton
                    icon="trash-can-outline"
                    iconColor={COLORS.vaultAccent}
                    size={20}
                    onPress={() => deleteEntry(item.id)}
                  />
                </View>
              )}
            />
          </Card>
        )}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: COLORS.primary }]}
        color={COLORS.surface}
        onPress={() => navigation.navigate('FinanceForm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  summaryCard: { margin: 16, marginBottom: 8, backgroundColor: COLORS.surface },
  summaryContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { color: COLORS.grey, marginBottom: 4 },
  summaryDivider: { width: 1, height: 30, backgroundColor: COLORS.lightGrey },
  filterWrapper: { paddingHorizontal: 16, marginBottom: 8 },
  segmented: { backgroundColor: COLORS.surface },
  list: { paddingHorizontal: 16, paddingBottom: 80, flexGrow: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  card: { marginBottom: 10, backgroundColor: COLORS.surface },
  typeIcon: { fontSize: 24, fontWeight: 'bold', marginLeft: 12 },
  rightContainer: { flexDirection: 'row', alignItems: 'center' },
  amountText: { fontSize: 16, fontWeight: 'bold', marginRight: 4 },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
