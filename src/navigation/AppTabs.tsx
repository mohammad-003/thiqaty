import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import DashboardScreen from '@/screens/Dashboard';
import TasksScreen from '@/screens/Tasks';
import NotesScreen from '@/screens/Notes';
import FinanceScreen from '@/screens/Finance';
import LinksScreen from '@/screens/Links';
import VaultScreen from '@/screens/Vault';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.surface,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarStyle: { backgroundColor: COLORS.surface },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Notes" 
        component={NotesScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="note-text-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Finance" 
        component={FinanceScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cash-multiple" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Links" 
        component={LinksScreen} 
        options={{
          title: 'Links & Contacts',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="card-account-phone-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Vault" 
        component={VaultScreen} 
        options={{
          title: 'Vault',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="shield-key-outline" size={size} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}
