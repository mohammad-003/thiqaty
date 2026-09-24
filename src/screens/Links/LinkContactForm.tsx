import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, SegmentedButtons, useTheme, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLinksContacts } from '@/db/repositories/useLinksContacts';
import { COLORS } from '@/constants/theme';

const schema = yup.object().shape({
  label: yup.string().required('Label is required'),
  value: yup.string().required('Value is required'),
});

export default function LinkContactForm({ navigation }: any) {
  const { addItem } = useLinksContacts();
  const theme = useTheme();
  const [type, setType] = useState<'link' | 'email' | 'phone'>('link');

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      label: '',
      value: '',
    }
  });

  const onSubmit = (data: any) => {
    addItem(data.label, type, data.value);
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Type</Text>
      <SegmentedButtons
        value={type}
        onValueChange={(val: any) => setType(val)}
        buttons={[
          { value: 'link', label: 'Web Link' },
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
        ]}
        style={styles.segmented}
      />

      <Controller
        control={control}
        name="label"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Label / Name (e.g. Portfolio, John Doe, Tax Portal)"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            error={!!errors.label}
            style={styles.input}
          />
        )}
      />
      {errors.label && <Text style={styles.errorText}>{errors.label.message}</Text>}

      <Controller
        control={control}
        name="value"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label={type === 'link' ? 'URL (e.g. example.com)' : type === 'email' ? 'Email Address' : 'Phone Number'}
            value={value}
            onChangeText={onChange}
            mode="outlined"
            error={!!errors.value}
            keyboardType={type === 'email' ? 'email-address' : type === 'phone' ? 'phone-pad' : 'url'}
            autoCapitalize="none"
            style={styles.input}
          />
        )}
      />
      {errors.value && <Text style={styles.errorText}>{errors.value.message}</Text>}

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
  submitButton: { marginTop: 24, paddingVertical: 6 },
});
