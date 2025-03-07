
import { useState, useEffect } from 'react';
import { BackupVersion } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export const useBackupVersions = () => {
  const [versions, setVersions] = useState<BackupVersion[]>(() => {
    try {
      const saved = localStorage.getItem('backupVersions');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to parse backup versions from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('backupVersions', JSON.stringify(versions));
  }, [versions]);

  const addVersion = (name: string, data: any) => {
    const newVersion: BackupVersion = {
      id: uuidv4(),
      name,
      timestamp: new Date().toISOString(),
      data
    };
    
    setVersions(prev => [newVersion, ...prev]);
    return newVersion;
  };

  const updateVersionName = (id: string, name: string) => {
    setVersions(prev => 
      prev.map(version => 
        version.id === id ? { ...version, name } : version
      )
    );
  };

  const deleteVersion = (id: string) => {
    setVersions(prev => prev.filter(version => version.id !== id));
  };

  const restoreVersion = (id: string) => {
    const version = versions.find(v => v.id === id);
    if (!version) return null;
    
    // Store the data in localStorage
    localStorage.setItem('bookmarks', JSON.stringify(version.data.bookmarks));
    localStorage.setItem('categories', JSON.stringify(version.data.categories));
    localStorage.setItem('appSettings', JSON.stringify(version.data.settings));
    
    return version;
  };

  return {
    versions,
    addVersion,
    updateVersionName,
    deleteVersion,
    restoreVersion
  };
};
