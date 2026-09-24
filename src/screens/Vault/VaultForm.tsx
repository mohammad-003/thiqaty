import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useVault } from '@/db/repositories/useVault';
import { COLORS } from '@/constants/theme';

const schema = yup.object().shape({
  title: yup.string().required('Account/App name is required'),
  username: yup.string().required('Username or Email is required'),
  password: yup.string().required('Password is required'),
  notes: yup.string().optional(),
});

export default function VaultForm({ navigation }: any) {
  const { addVaultEntry } = useVault();
  const theme = useTheme();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      username: '',
      password: '',
      notes: '',
    }
  });

  const onSubmit = (data: any) => {
    addVaultEntry(data.title, data.username, data.password, data.notes);
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Service / Website Name (e.g. GitHub, Google)"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            error={!!errors.title}
            style={styles.input}
          />
        )}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Username / Email"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            autoCapitalize="none"
            error={!!errors.username}
            style={styles.input}
          />
        )}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Password"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            secureTextEntry
            error={!!errors.password}
            style={styles.input}
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Notes (Optional)"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            multiline
            style={styles.input}
          />
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
        Encrypt & Save Password
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  input: { marginBottom: 12, backgroundColor: COLORS.surface },
  errorText: { color: COLORS.error, fontSize: 12, marginBottom: 8, marginLeft: 4 },
  submitButton: { marginTop: 24, paddingVertical: 6, backgroundColor: COLORS.vaultAccent },
});
