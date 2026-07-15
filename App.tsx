import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { getOrInitializeRealmKey } from '@/services/encryption';
import { RealmProvider } from '@/db/realmConfig';
import RootNavigator from '@/navigation/RootNavigator';

export default function App() {
  const [encryptionKey, setEncryptionKey] = useState<Int8Array | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadKey() {
      try {
        const key = await getOrInitializeRealmKey();
        setEncryptionKey(key);
      } catch (e) {
        setError(e as Error);
      }
    }
    loadKey();
  }, []);

  if (error) {
    // In a real app, this should display a fatal error screen (e.g. secure hardware failed)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="red" />
      </View>
    );
  }

  if (!encryptionKey) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0F6E56" />
      </View>
    );
  }

  return (
    <RealmProvider encryptionKey={encryptionKey}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </RealmProvider>
  );
}
