import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useAuthStore } from '@/store/authStore';
import { useRealm, useQuery } from '@/db/realmConfig';
import { User } from '@/db/schemas';
import { hashPin, verifyPin, promptBiometric } from '@/services/auth';
import { v4 as uuidv4 } from 'uuid';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AuthScreen({ route }: any) {
  const { mode } = route.params; // 'setup' | 'unlock'
  const { setSetup, setUnlocked } = useAuthStore();
  const theme = useTheme();
  const realm = useRealm();
  
  // We only expect one user since it's a single-user app
  const users = useQuery(User);
  const currentUser = users.length > 0 ? users[0] : null;

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto prompt biometric on unlock mode
  useEffect(() => {
    if (mode === 'unlock' && currentUser?.biometricEnabled) {
      handleBiometricUnlock();
    }
  }, [mode, currentUser]);

  const handleBiometricUnlock = async () => {
    const success = await promptBiometric();
    if (success) {
      setUnlocked(true);
    }
  };

  const handleSetup = () => {
    setError('');
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);
    // Hash PIN and save user
    setTimeout(() => {
      const hashed = hashPin(pin);
      realm.write(() => {
        realm.create(User.schema.name, {
          id: uuidv4(),
          pinHash: hashed,
          biometricEnabled: true, // Auto enable for now, can be toggled in settings
          autoLockMinutes: 2,
          createdAt: new Date(),
        });
      });
      setSetup(true);
      setUnlocked(true);
      setLoading(false);
    }, 100);
  };

  const handleUnlock = () => {
    setError('');
    if (!currentUser) {
      setError('No user found to unlock.');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const isValid = verifyPin(pin, currentUser.pinHash);
      if (isValid) {
        setUnlocked(true);
      } else {
        setError('Incorrect PIN');
      }
      setLoading(false);
    }, 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: theme.colors.background }]} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <MaterialCommunityIcons 
            name={mode === 'setup' ? 'shield-lock-outline' : 'lock-outline'} 
            size={80} 
            color={COLORS.primary} 
            style={styles.icon}
          />
          
          <Text variant="headlineMedium" style={styles.title}>
            {mode === 'setup' ? 'Welcome to Thiqaty' : 'Unlock Vault'}
          </Text>
          
          <Text variant="bodyLarge" style={styles.subtitle}>
            {mode === 'setup' 
              ? 'Set a secure PIN to encrypt your local data. This PIN cannot be recovered if lost.' 
              : 'Enter your PIN to access your secure data.'}
          </Text>

          <TextInput
            label="Enter PIN"
            value={pin}
            onChangeText={setPin}
            secureTextEntry
            keyboardType="numeric"
            maxLength={8}
            style={styles.input}
            mode="outlined"
            outlineColor={COLORS.primary}
            activeOutlineColor={COLORS.primary}
          />

          {mode === 'setup' && (
            <TextInput
              label="Confirm PIN"
              value={confirmPin}
              onChangeText={setConfirmPin}
              secureTextEntry
              keyboardType="numeric"
              maxLength={8}
              style={styles.input}
              mode="outlined"
              outlineColor={COLORS.primary}
              activeOutlineColor={COLORS.primary}
            />
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button 
            mode="contained" 
            onPress={mode === 'setup' ? handleSetup : handleUnlock}
            loading={loading}
            disabled={loading || pin.length < 4 || (mode === 'setup' && confirmPin.length < 4)}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {mode === 'setup' ? 'Complete Setup' : 'Unlock'}
          </Button>

          {mode === 'unlock' && currentUser?.biometricEnabled && (
            <Button 
              mode="outlined" 
              onPress={handleBiometricUnlock}
              icon="fingerprint"
              style={[styles.button, styles.biometricButton]}
              textColor={COLORS.primary}
            >
              Use Biometrics
            </Button>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#173248', // matches primary
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: 32,
    opacity: 0.8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  biometricButton: {
    marginTop: 16,
    borderColor: COLORS.primary,
  },
  errorText: {
    color: COLORS.vaultAccent,
    textAlign: 'center',
    marginBottom: 16,
  },
});
