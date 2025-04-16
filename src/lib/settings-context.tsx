"use client";

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  ReactNode 
} from 'react';
import { useAuth } from './auth-context';

// Settings interface
export interface AppSettings {
  darkMode: boolean;
  volume: number;
  visualizerEnabled: boolean;
}

// Default settings
const defaultSettings: AppSettings = {
  darkMode: true,
  volume: 80,
  visualizerEnabled: true
};

// Storage key for settings
const SETTINGS_STORAGE_KEY = 'resonance-app-settings';

// Settings context type
interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const { user } = useAuth();

  // Load settings on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        if (typeof window === 'undefined') return;
        
        const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Update settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      }
      
      // Apply theme changes
      if (newSettings.darkMode !== undefined) {
        document.documentElement.classList.toggle('dark', updated.darkMode);
        document.documentElement.classList.toggle('light', !updated.darkMode);
      }
      
      return updated;
    });
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
    }
    document.documentElement.classList.toggle('dark', defaultSettings.darkMode);
    document.documentElement.classList.toggle('light', !defaultSettings.darkMode);
  };

  // Apply theme on mount and settings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', settings.darkMode);
      document.documentElement.classList.toggle('light', !settings.darkMode);
    }
  }, [settings.darkMode]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
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