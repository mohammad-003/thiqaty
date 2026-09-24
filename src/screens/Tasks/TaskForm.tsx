import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useTasks } from '@/db/repositories/useTasks';
import { COLORS } from '@/constants/theme';

const schema = yup.object().shape({
  title: yup.string().required('Task title is required').max(120),
});

export default function TaskForm({ navigation }: any) {
  const { addTask } = useTasks();
  const theme = useTheme();
  
  const [dateTime, setDateTime] = useState(new Date(Date.now() + 10 * 60 * 1000)); // Default +10 mins
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [showPicker, setShowPicker] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
    }
  });

  const onSubmit = async (data: any) => {
    await addTask(data.title, dateTime);
    navigation.goBack();
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setMode(currentMode);
    setShowPicker(true);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="What do you need to do?"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            error={!!errors.title}
            style={styles.input}
          />
        )}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

      <Text style={styles.label}>Reminder Date & Time</Text>
      
      <View style={styles.dateTimeRow}>
        <Button 
          mode="outlined" 
          icon="calendar"
          onPress={() => showMode('date')}
          style={styles.flexButton}
        >
          {format(dateTime, 'PPP')}
        </Button>

        <Button 
          mode="outlined" 
          icon="clock-outline"
          onPress={() => showMode('time')}
          style={styles.flexButton}
        >
          {format(dateTime, 'p')}
        </Button>
      </View>

      {showPicker && (
        <DateTimePicker
          value={dateTime}
          mode={mode}
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(Platform.OS === 'ios');
            if (selectedDate) setDateTime(selectedDate);
          }}
        />
      )}

      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
        Set Task & Reminder
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  input: { marginBottom: 12, backgroundColor: COLORS.surface },
  errorText: { color: COLORS.error, fontSize: 12, marginBottom: 8, marginLeft: 4 },
  label: { marginTop: 12, marginBottom: 8, color: COLORS.text, fontWeight: 'bold' },
  dateTimeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  flexButton: { flex: 1, borderColor: COLORS.grey },
  submitButton: { marginTop: 24, paddingVertical: 6 },
});
