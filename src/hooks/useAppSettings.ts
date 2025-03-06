
import { useState, useEffect } from 'react';
import { AppSettings } from '@/lib/types';

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse app settings from localStorage', e);
        return {};
      }
    }
    return {};
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const setBackgroundColor = (color: string) => {
    setSettings(prev => ({ ...prev, backgroundColor: color }));
  };

  return {
    settings,
    setBackgroundColor
  };
};
