
import { useState, useEffect } from 'react';
import { AppSettings } from '@/lib/types';

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings | null>(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse app settings from localStorage', e);
        return createDefaultSettings();
      }
    }
    // Return default settings if none exist
    return createDefaultSettings();
  });

  // Create default settings object
  function createDefaultSettings(): AppSettings {
    return {
      backgroundColor: undefined,
      theme: 'system'
    };
  }

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (settings) {
      localStorage.setItem('appSettings', JSON.stringify(settings));
    }
  }, [settings]);

  // Set background color
  const setBackgroundColor = (color: string) => {
    setSettings(prev => ({
      ...prev || createDefaultSettings(),
      backgroundColor: color
    }));
  };

  // Set theme
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({
      ...prev || createDefaultSettings(),
      theme
    }));

    // Update the document with the theme data attribute
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    
    // If system theme, detect and set based on system preference
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.toggle('dark', isDark);
    } else {
      html.classList.toggle('dark', theme === 'dark');
    }
  };

  // Initialize theme on first load
  useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme);
    }
  }, []);

  return {
    settings,
    setBackgroundColor,
    setTheme
  };
};
