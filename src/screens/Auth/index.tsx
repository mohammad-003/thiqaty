import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/authStore';

export default function AuthScreen({ route }: any) {
  const { mode } = route.params;
  const { setSetup, setUnlocked } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Auth Screen ({mode})</Text>
      <Button 
        title={mode === 'setup' ? "Complete PIN Setup" : "Unlock with Biometrics/PIN"} 
        onPress={() => {
          if (mode === 'setup') {
            setSetup(true);
          }
          setUnlocked(true);
        }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});
