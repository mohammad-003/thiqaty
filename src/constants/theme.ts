import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#173248', // Navy Blue from Logo
  accent: '#E6F4FE', // Light blue from adaptive icon background
  accentDark: '#102537', 
  background: '#F5F7FA', // Soft cool gray background
  surface: '#FFFFFF',
  text: '#1A1A1A', 
  vaultAccent: '#E03C3C', 
  error: '#B00020',
  success: '#2E7D32',
  grey: '#9E9E9E',
  lightGrey: '#E0E0E0',
};

export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.accent,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.vaultAccent,
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: COLORS.text,
  },
};
