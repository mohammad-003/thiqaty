import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@/db/realmConfig';
import { User } from '@/db/schemas';

import AuthScreen from '@/screens/Auth';
import AppStack from './AppStack';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isSetup, isUnlocked, setSetup } = useAuthStore();
  const users = useQuery(User);

  useEffect(() => {
    if (users.length > 0 && !isSetup) {
      setSetup(true);
    }
  }, [users, isSetup, setSetup]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isSetup ? (
        // First run: Need to setup PIN
        <Stack.Screen name="Setup" component={AuthScreen} initialParams={{ mode: 'setup' }} />
      ) : !isUnlocked ? (
        // Locked: Need to unlock with Biometrics or PIN
        <Stack.Screen name="Unlock" component={AuthScreen} initialParams={{ mode: 'unlock' }} />
      ) : (
        // Unlocked: Main App
        <Stack.Screen name="App" component={AppStack} />
      )}
    </Stack.Navigator>
  );
}
