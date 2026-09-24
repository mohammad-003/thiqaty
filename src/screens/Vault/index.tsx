import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Clipboard, AppState, Platform } from 'react-native';
import { Text, FAB, Card, Button, useTheme, IconButton, Avatar, Snackbar } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { useVault, decryptVaultPassword } from '@/db/repositories/useVault';
import { promptBiometric } from '@/services/auth';
import { COLORS } from '@/constants/theme';

export default function VaultScreen({ navigation }: any) {
  const { entries, deleteVaultEntry } = useVault();
  const theme = useTheme();
  const isFocused = useIsFocused();

  const [unlocked, setUnlocked] = useState(false);
  const [revealedIds, setRevealedIds] = useState<{ [id: string]: boolean }>({});
  const [snackbarMsg, setSnackbarMsg] = useState('');

  // Auto-lock vault on tab blur or app backgrounding
  useEffect(() => {
    if (!isFocused) {
      setUnlocked(false);
      setRevealedIds({});
    }
  }, [isFocused]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState !== 'active') {
        setUnlocked(false);
        setRevealedIds({});
      }
    });
    return () => subscription.remove();
  }, []);

  const handleStepUpAuth = async () => {
    const success = await promptBiometric('Authenticate to access Password Vault');
    if (success) {
      setUnlocked(true);
    } else {
      setSnackbarMsg('Biometric authentication failed');
    }
  };

  const togglePasswordReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (cipherText: string) => {
    const plain = decryptVaultPassword(cipherText);
    Clipboard.setString(plain);
    setSnackbarMsg('Password copied! Will clear in 30 seconds.');

    setTimeout(() => {
      Clipboard.setString('');
    }, 30000);
  };

  if (!unlocked) {
    return (
      <View style={[styles.lockedContainer, { backgroundColor: theme.colors.background }]}>
        <Avatar.Icon icon="shield-lock-outline" size={90} style={{ backgroundColor: COLORS.vaultAccent, marginBottom: 20 }} />
        <Text variant="headlineMedium" style={styles.lockedTitle}>Password Vault Locked</Text>
        <Text variant="bodyLarge" style={styles.lockedSubtitle}>
          Step-up biometric verification is required to view encrypted credentials.
        </Text>
        <Button 
          mode="contained" 
          icon="fingerprint" 
          onPress={handleStepUpAuth}
          style={styles.unlockButton}
          contentStyle={{ paddingVertical: 8 }}
        >
          Unlock Vault
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: COLORS.grey }}>No passwords saved in vault.</Text>
            <Text variant="bodyMedium" style={{ color: COLORS.grey }}>Tap + to store a credential securely.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isRevealed = !!revealedIds[item.id];
          const passwordText = isRevealed ? decryptVaultPassword(item.encryptedPassword) : '••••••••••••';

          return (
            <Card style={styles.card} mode="elevated">
              <Card.Title 
                title={item.title} 
                subtitle={`User: ${item.username}`}
                left={(props) => <Avatar.Icon {...props} icon="key-outline" style={{ backgroundColor: COLORS.vaultAccent }} />}
                right={() => (
                  <IconButton
                    icon="trash-can-outline"
                    iconColor={COLORS.vaultAccent}
                    onPress={() => deleteVaultEntry(item.id)}
                  />
                )}
              />
              <Card.Content>
                <View style={styles.passwordRow}>
                  <Text style={styles.passwordValue}>{passwordText}</Text>
                  <IconButton 
                    icon={isRevealed ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    onPress={() => togglePasswordReveal(item.id)}
                  />
                  <IconButton 
                    icon="content-copy"
                    size={20}
                    onPress={() => copyToClipboard(item.encryptedPassword)}
                  />
                </View>
                {item.notes ? <Text style={styles.notesText}>Notes: {item.notes}</Text> : null}
              </Card.Content>
            </Card>
          );
        }}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: COLORS.vaultAccent }]}
        color={COLORS.surface}
        onPress={() => navigation.navigate('VaultForm')}
      />

      <Snackbar
        visible={!!snackbarMsg}
        onDismiss={() => setSnackbarMsg('')}
        duration={3000}
      >
        {snackbarMsg}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lockedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  lockedTitle: { fontWeight: 'bold', color: COLORS.text, marginBottom: 8, textAlign: 'center' },
  lockedSubtitle: { color: COLORS.grey, textAlign: 'center', marginBottom: 32 },
  unlockButton: { borderRadius: 8, backgroundColor: COLORS.vaultAccent, width: '100%' },
  list: { padding: 16, paddingBottom: 80, flexGrow: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  card: { marginBottom: 12, backgroundColor: COLORS.surface },
  passwordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, paddingLeft: 12, borderRadius: 6, marginTop: 4 },
  passwordValue: { flex: 1, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: COLORS.text },
  notesText: { fontSize: 12, color: COLORS.grey, marginTop: 8 },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
