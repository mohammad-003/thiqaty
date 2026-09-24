import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { TextInput, Button, useTheme, Text, SegmentedButtons } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNotes } from '@/db/repositories/useNotes';
import { NoteCategory } from '@/db/schemas';
import { COLORS } from '@/constants/theme';

const CATEGORIES: NoteCategory[] = [
  'General',
  'Personal',
  'Company',
  'Freelance',
  'Exam Prep',
  'Interview Prep',
];

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  body: yup.string().required('Note body is required'),
});

export default function NoteForm({ route, navigation }: any) {
  const { addNote } = useNotes();
  const theme = useTheme();
  const [category, setCategory] = useState<NoteCategory>('General');

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      body: '',
    }
  });

  const onSubmit = (data: any) => {
    addNote(data.title, data.body, category);
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Title"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            error={!!errors.title}
            style={styles.input}
          />
        )}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

      <Text style={styles.label}>Category Tag</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
        <View style={styles.catRow}>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              mode={category === cat ? 'contained' : 'outlined'}
              onPress={() => setCategory(cat)}
              style={styles.catButton}
              compact
            >
              {cat}
            </Button>
          ))}
        </View>
      </ScrollView>

      <Controller
        control={control}
        name="body"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Note Details"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            multiline
            numberOfLines={8}
            error={!!errors.body}
            style={[styles.input, styles.textArea]}
          />
        )}
      />
      {errors.body && <Text style={styles.errorText}>{errors.body.message}</Text>}

      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
        Save Note
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  input: { marginBottom: 12, backgroundColor: COLORS.surface },
  textArea: { minHeight: 180 },
  errorText: { color: COLORS.error, fontSize: 12, marginBottom: 8, marginLeft: 4 },
  label: { marginTop: 8, marginBottom: 8, color: COLORS.text, fontWeight: 'bold' },
  catScroll: { marginBottom: 16 },
  catRow: { flexDirection: 'row', gap: 8 },
  catButton: { borderRadius: 16 },
  submitButton: { marginTop: 24, paddingVertical: 6 },
});
