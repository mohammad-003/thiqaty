
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/authStore';

export default function DashboardScreen() {
  const { lockApp } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thiqaty Dashboard</Text>
      <Text style={styles.subtext}>Everything is secure and offline.</Text>
      <Button title="Lock App (Test Auto-Lock Logic)" onPress={lockApp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#0F6E56' },
  subtext: { fontSize: 16, marginBottom: 30, color: '#2C2C2A' },
});
