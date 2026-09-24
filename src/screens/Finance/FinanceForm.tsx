import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, SegmentedButtons, useTheme, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useFinance } from '@/db/repositories/useFinance';
import { COLORS } from '@/constants/theme';

const schema = yup.object().shape({
  amount: yup.string().required('Amount is required').test('is-positive-number', 'Must be a valid positive number', (val) => {
    const num = parseFloat(val || '');
    return !isNaN(num) && num > 0;
  }),
  category: yup.string().required('Category is required'),
  note: yup.string().optional(),
});

export default function FinanceForm({ navigation }: any) {
  const { addEntry } = useFinance();
  const theme = useTheme();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: '',
      category: '',
      note: '',
    }
  });

  const onSubmit = (data: any) => {
    addEntry(type, parseFloat(data.amount), data.category, date, data.note);
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Transaction Type</Text>
      <SegmentedButtons
        value={type}
        onValueChange={(val: any) => setType(val)}
        buttons={[
          { value: 'expense', label: 'Expense (-)' },
          { value: 'income', label: 'Income (+)' },
        ]}
        style={styles.segmented}
      />

      <Controller
        control={control}
        name="amount"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Amount ($)"
            value={value}
            onChangeText={onChange}
            keyboardType="decimal-pad"
            mode="outlined"
            error={!!errors.amount}
            style={styles.input}
          />
        )}
      />
      {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}

      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Category (e.g. Salary, Rent, Food, Freelance)"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            error={!!errors.category}
            style={styles.input}
          />
        )}
      />
      {errors.category && <Text style={styles.errorText}>{errors.category.message}</Text>}

      <Text style={styles.label}>Transaction Date</Text>
      <Button 
        mode="outlined" 
        icon="calendar"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        {format(date, 'PPP')}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Controller
        control={control}
        name="note"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Notes (Optional)"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            style={styles.input}
          />
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
        Save Entry
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  input: { marginBottom: 12, backgroundColor: COLORS.surface },
  errorText: { color: COLORS.error, fontSize: 12, marginBottom: 8, marginLeft: 4 },
  label: { marginTop: 8, marginBottom: 8, color: COLORS.text, fontWeight: 'bold' },
  segmented: { marginBottom: 16 },
  dateButton: { marginBottom: 16, borderColor: COLORS.grey },
  submitButton: { marginTop: 24, paddingVertical: 6 },
});
