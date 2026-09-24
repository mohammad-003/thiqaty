import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme, Avatar, ProgressBar } from 'react-native-paper';
import { useAuthStore } from '@/store/authStore';
import { useTasks } from '@/db/repositories/useTasks';
import { useFinance } from '@/db/repositories/useFinance';
import { useNotes } from '@/db/repositories/useNotes';
import { format } from 'date-fns';
import { COLORS } from '@/constants/theme';

export default function DashboardScreen({ navigation }: any) {
  const { lockApp } = useAuthStore();
  const theme = useTheme();

  const { tasks } = useTasks();
  const { entries } = useFinance();
  const { notes } = useNotes();

  const pendingTasks = tasks.filtered('done == false').slice(0, 3);
  const recentTransactions = entries.slice(0, 4);

  // Compute expense spending breakdown by category
  const expenseEntries = entries.filtered('type == "expense"');
  const totalExpense = expenseEntries.sum('amount') || 0;

  const categoryTotals: { [cat: string]: number } = {};
  expenseEntries.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const categoryBreakdown = Object.keys(categoryTotals).map((cat) => ({
    category: cat,
    amount: categoryTotals[cat],
    percentage: totalExpense > 0 ? categoryTotals[cat] / totalExpense : 0,
  })).sort((a, b) => b.amount - a.amount);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={styles.title}>Thiqaty</Text>
          <Text variant="bodySmall" style={{ color: COLORS.grey }}>Personal & Local Vault</Text>
        </View>
        <Button 
          mode="outlined" 
          onPress={lockApp} 
          icon="lock-outline"
          textColor={COLORS.vaultAccent} 
          style={{ borderColor: COLORS.vaultAccent }}
        >
          Lock
        </Button>
      </View>

      <View style={styles.content}>
        {/* Category Spending Pie / Percentage Breakdown */}
        <Card style={styles.card} mode="elevated">
          <Card.Title title="Expense Breakdown by Category" left={(props) => <Avatar.Icon {...props} icon="chart-pie" style={{ backgroundColor: COLORS.primary }} />} />
          <Card.Content>
            {categoryBreakdown.length === 0 ? (
              <Text style={styles.emptyText}>No expenses logged yet.</Text>
            ) : (
              categoryBreakdown.map((item, index) => (
                <View key={item.category} style={styles.chartItem}>
                  <View style={styles.chartRow}>
                    <Text style={styles.catName}>{item.category}</Text>
                    <Text style={styles.catAmount}>${item.amount.toFixed(2)} ({Math.round(item.percentage * 100)}%)</Text>
                  </View>
                  <ProgressBar 
                    progress={item.percentage} 
                    color={index % 2 === 0 ? COLORS.primary : COLORS.accentDark} 
                    style={styles.progressBar} 
                  />
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Upcoming Tasks */}
        <Card style={styles.card} mode="elevated" onPress={() => navigation.navigate('Tasks')}>
          <Card.Title 
            title="Upcoming Tasks" 
            subtitle={`${tasks.filtered('done == false').length} pending`}
            left={(props) => <Avatar.Icon {...props} icon="checkbox-marked-circle-outline" style={{ backgroundColor: COLORS.primary }} />} 
          />
          <Card.Content>
            {pendingTasks.length === 0 ? (
              <Text style={styles.emptyText}>No pending tasks scheduled.</Text>
            ) : (
              pendingTasks.map((t) => (
                <View key={t.id} style={styles.taskItem}>
                  <Text style={styles.taskTitle}>• {t.title}</Text>
                  <Text style={styles.taskDate}>{format(t.dateTime, 'MMM dd, p')}</Text>
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Recent Finance Ledger */}
        <Card style={styles.card} mode="elevated" onPress={() => navigation.navigate('Finance')}>
          <Card.Title 
            title="Recent Transactions" 
            left={(props) => <Avatar.Icon {...props} icon="cash-multiple" style={{ backgroundColor: COLORS.accentDark }} />} 
          />
          <Card.Content>
            {recentTransactions.length === 0 ? (
              <Text style={styles.emptyText}>No recent transactions.</Text>
            ) : (
              recentTransactions.map((tx) => (
                <View key={tx.id} style={styles.txItem}>
                  <Text style={styles.txCategory}>{tx.category}</Text>
                  <Text style={[styles.txAmount, { color: tx.type === 'income' ? COLORS.success : COLORS.vaultAccent }]}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </Text>
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: COLORS.surface },
  title: { color: COLORS.primary, fontWeight: 'bold' },
  content: { padding: 16, gap: 12 },
  card: { backgroundColor: COLORS.surface },
  emptyText: { color: COLORS.grey, fontStyle: 'italic', marginVertical: 4 },
  chartItem: { marginBottom: 10 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  catName: { fontWeight: '600', color: COLORS.text },
  catAmount: { color: COLORS.grey, fontSize: 12 },
  progressBar: { height: 8, borderRadius: 4 },
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  taskTitle: { color: COLORS.text, fontWeight: '500' },
  taskDate: { color: COLORS.grey, fontSize: 12 },
  txItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.lightGrey },
  txCategory: { color: COLORS.text, fontWeight: '500' },
  txAmount: { fontWeight: 'bold' },
});
