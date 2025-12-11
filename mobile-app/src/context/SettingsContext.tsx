import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';
import { getColors } from '../constants/theme';

const SETTINGS_STORAGE_KEY = '@kickoff_club_settings';

interface Settings {
  darkMode: boolean;
  notificationsEnabled: boolean;
}

type ThemeColors = ReturnType<typeof getColors>;

interface SettingsContextType {
  settings: Settings;
  isDarkMode: boolean;
  notificationsEnabled: boolean;
  toggleDarkMode: () => void;
  toggleNotifications: () => Promise<void>;
  isLoading: boolean;
  colors: ThemeColors;
}

const defaultSettings: Settings = {
  darkMode: true,
  notificationsEnabled: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleDarkMode = useCallback(() => {
    setSettings((prev) => {
      const newSettings = { ...prev, darkMode: !prev.darkMode };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const toggleNotifications = useCallback(async () => {
    const newValue = !settings.notificationsEnabled;

    if (newValue) {
      // Request permission when enabling notifications
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive updates.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Configure notification handler
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }

    setSettings((prev) => {
      const newSettings = { ...prev, notificationsEnabled: newValue };
      saveSettings(newSettings);
      return newSettings;
    });
  }, [settings.notificationsEnabled]);

  const colors = useMemo(() => getColors(settings.darkMode), [settings.darkMode]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isDarkMode: settings.darkMode,
        notificationsEnabled: settings.notificationsEnabled,
        toggleDarkMode,
        toggleNotifications,
        isLoading,
        colors,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
