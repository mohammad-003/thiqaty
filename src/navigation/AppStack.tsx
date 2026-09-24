import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '@/constants/theme';

import AppTabs from './AppTabs';
import TaskForm from '@/screens/Tasks/TaskForm';
import NoteForm from '@/screens/Notes/NoteForm';
import FinanceForm from '@/screens/Finance/FinanceForm';
import LinkContactForm from '@/screens/Links/LinkContactForm';
import VaultForm from '@/screens/Vault/VaultForm';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.surface,
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={AppTabs} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="TaskForm" 
        component={TaskForm} 
        options={({ route }: any) => ({
          title: route.params?.taskId ? 'Edit Task' : 'New Task',
        })} 
      />
      <Stack.Screen 
        name="NoteForm" 
        component={NoteForm} 
        options={({ route }: any) => ({
          title: route.params?.id ? 'Edit Note' : 'New Note',
        })} 
      />
      <Stack.Screen 
        name="FinanceForm" 
        component={FinanceForm} 
        options={({ route }: any) => ({
          title: route.params?.id ? 'Edit Transaction' : 'New Transaction',
        })} 
      />
      <Stack.Screen 
        name="LinkContactForm" 
        component={LinkContactForm} 
        options={({ route }: any) => ({
          title: route.params?.id ? 'Edit Entry' : 'New Link / Contact',
        })} 
      />
      <Stack.Screen 
        name="VaultForm" 
        component={VaultForm} 
        options={({ route }: any) => ({
          title: route.params?.id ? 'Edit Credential' : 'New Credential',
        })} 
      />
    </Stack.Navigator>
  );
}
