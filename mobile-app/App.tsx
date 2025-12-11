import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { Navigation } from './src/navigation';

function AppContent() {
  const { isDarkMode } = useSettings();
  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Navigation />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
