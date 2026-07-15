import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/authStore';

// We will import placeholder screens from the screens directory
import AuthScreen from '@/screens/Auth';
import DashboardScreen from '@/screens/Dashboard';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isSetup, isUnlocked } = useAuthStore();

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
        <Stack.Screen name="App" component={DashboardScreen} />
      )}
    </Stack.Navigator>
  );
}
