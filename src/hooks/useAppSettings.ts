
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
        return { theme: 'system' };
      }
    }
    return { theme: 'system' };
  });

  // On mount, apply theme based on settings or system preference
  useEffect(() => {
    applyTheme(settings.theme || 'system');
  }, []);

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Apply theme changes
    if (settings.theme) {
      applyTheme(settings.theme);
    }
  }, [settings]);

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const isDark = 
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setBackgroundColor = (color: string) => {
    setSettings(prev => ({ ...prev, backgroundColor: color }));
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({ ...prev, theme }));
  };

  // Listen for system theme changes if using system theme
  useEffect(() => {
    if (settings.theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      applyTheme('system');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [settings.theme]);

  return {
    settings,
    setBackgroundColor,
    setTheme
  };
};
