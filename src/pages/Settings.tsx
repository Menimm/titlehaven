
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useCategories } from '@/hooks/useCategories';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useFoldableSections } from '@/hooks/useFoldableSections';
import { useBackupVersions } from '@/hooks/useBackupVersions';
import BackupRestoreSection from '@/components/settings/BackupRestoreSection';
import AdvancedSection from '@/components/settings/AdvancedSection';
import DataFormatSection from '@/components/settings/DataFormatSection';
import ManualImportDialog from '@/components/settings/ManualImportDialog';
import EditJsonDialog from '@/components/settings/EditJsonDialog';
import VersionNameDialog from '@/components/settings/VersionNameDialog';
import ConfirmationDialogs from '@/components/settings/ConfirmationDialogs';

const Settings = () => {
  const navigate = useNavigate();
  const { bookmarks } = useBookmarks();
  const { categories } = useCategories();
  const { settings } = useAppSettings();
  const { 
    versions, addVersion, updateVersionName, 
    deleteVersion, restoreVersion 
  } = useBackupVersions();
  
  // Dialog states
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [manualImportData, setManualImportData] = useState('');
  const [manualImportError, setManualImportError] = useState('');
  
  // Advanced editing state
  const [editJsonData, setEditJsonData] = useState('');
  const [editJsonDialogOpen, setEditJsonDialogOpen] = useState(false);
  const [editJsonError, setEditJsonError] = useState('');
  
  // Version management state
  const [versionNameDialogOpen, setVersionNameDialogOpen] = useState(false);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [versionName, setVersionName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);
  
  // Foldable sections
  const { expandedSections, toggleSection } = useFoldableSections(['advanced']);

  // Create backup data
  const createBackupData = () => {
    return {
      version: 1,
      timestamp: new Date().toISOString(),
      data: {
        bookmarks,
        categories,
        settings
      }
    };
  };

  // Download backup file
  const handleExport = () => {
    try {
      const backupData = createBackupData();
      const jsonData = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `bookmark-haven-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Backup exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export backup');
    }
  };

  // Open dialog for manual JSON import
  const handleManualImport = () => {
    setManualImportData('');
    setManualImportError('');
    setImportDialogOpen(true);
  };

  // Process manually entered JSON
  const handleManualImportSubmit = () => {
    try {
      if (!manualImportData.trim()) {
        setManualImportError('Please enter JSON data');
        return;
      }
      
      // Re-use the function from BackupRestoreSection (pass as prop)
      processImportData(manualImportData);
      setImportDialogOpen(false);
    } catch (error) {
      console.error('Manual import error:', error);
      setManualImportError('Invalid JSON format. Please check your data.');
    }
  };
  
  // Process and validate import data
  const processImportData = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData);
      
      // Validate backup structure
      if (!parsedData.data || 
          !parsedData.data.bookmarks || 
          !parsedData.data.categories) {
        throw new Error('Invalid backup format');
      }
      
      // Store the imported data
      localStorage.setItem('bookmarks', JSON.stringify(parsedData.data.bookmarks));
      localStorage.setItem('categories', JSON.stringify(parsedData.data.categories));
      if (parsedData.data.settings) {
        localStorage.setItem('appSettings', JSON.stringify(parsedData.data.settings));
      }
      
      toast.success('Backup imported successfully. Refreshing app...');
      
      // Reload the page to apply the imported data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Process import error:', error);
      toast.error('Failed to import backup: Invalid format');
    }
  };

  // Advanced section - Edit JSON
  const handleEditJson = () => {
    const backupData = createBackupData();
    setEditJsonData(JSON.stringify(backupData, null, 2));
    setEditJsonError('');
    setEditJsonDialogOpen(true);
  };

  // Save edited JSON
  const handleSaveEditedJson = () => {
    try {
      if (!editJsonData.trim()) {
        setEditJsonError('Please enter JSON data');
        return;
      }
      
      processImportData(editJsonData);
      setEditJsonDialogOpen(false);
    } catch (error) {
      console.error('Edit JSON error:', error);
      setEditJsonError('Invalid JSON format. Please check your data.');
    }
  };

  // Save current state as a version
  const handleSaveVersion = () => {
    setVersionName(`Backup ${new Date().toLocaleDateString()}`);
    setVersionNameDialogOpen(true);
  };

  // Confirm save version
  const handleConfirmSaveVersion = () => {
    if (!versionName.trim()) {
      toast.error('Please enter a name for this version');
      return;
    }
    
    const backupData = createBackupData().data;
    addVersion(versionName.trim(), backupData);
    setVersionNameDialogOpen(false);
    toast.success(`Version "${versionName}" saved successfully`);
  };

  // Update version name
  const handleEditVersionName = (id: string, currentName: string) => {
    setCurrentVersionId(id);
    setVersionName(currentName);
    setVersionNameDialogOpen(true);
  };

  // Confirm update version name
  const handleConfirmUpdateVersionName = () => {
    if (!currentVersionId || !versionName.trim()) {
      toast.error('Please enter a name for this version');
      return;
    }
    
    updateVersionName(currentVersionId, versionName.trim());
    setVersionNameDialogOpen(false);
    setCurrentVersionId(null);
    toast.success('Version name updated successfully');
  };

  // Download a specific version
  const handleDownloadVersion = (version: any) => {
    try {
      const jsonData = JSON.stringify({
        version: 1,
        timestamp: version.timestamp,
        data: version.data
      }, null, 2);
      
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `bookmark-haven-${version.name.replace(/\s+/g, '-')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Version "${version.name}" exported successfully`);
    } catch (error) {
      console.error('Version export error:', error);
      toast.error('Failed to export version');
    }
  };

  // Delete version confirmation
  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      deleteVersion(confirmDeleteId);
      setConfirmDeleteId(null);
      toast.success('Version deleted successfully');
    }
  };

  // Restore version confirmation
  const handleConfirmRestore = () => {
    if (confirmRestoreId) {
      const restoredVersion = restoreVersion(confirmRestoreId);
      setConfirmRestoreId(null);
      
      if (restoredVersion) {
        toast.success(`Version "${restoredVersion.name}" restored successfully. Refreshing app...`);
        
        // Reload the page to apply the restored data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error('Failed to restore version');
      }
    }
  };

  // Cancel version name dialog
  const handleCancelVersionName = () => {
    setVersionNameDialogOpen(false);
    setCurrentVersionId(null);
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: settings?.backgroundColor || 'var(--background)',
        color: settings?.backgroundColor ? 'inherit' : 'var(--foreground)'
      }}
    >
      <div className="container max-w-4xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Bookmarks
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <BackupRestoreSection 
          onManualImport={handleManualImport}
          onExport={handleExport}
        />
        
        <AdvancedSection 
          expanded={expandedSections['advanced']}
          onToggle={() => toggleSection('advanced')}
          versions={versions}
          onEditJson={handleEditJson}
          onSaveVersion={handleSaveVersion}
          onEditVersionName={handleEditVersionName}
          onDownloadVersion={handleDownloadVersion}
          onRequestRestore={(id) => setConfirmRestoreId(id)}
          onRequestDelete={(id) => setConfirmDeleteId(id)}
        />
        
        <DataFormatSection />
      </div>
      
      <ManualImportDialog 
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        importData={manualImportData}
        onImportDataChange={(value) => {
          setManualImportData(value);
          setManualImportError('');
        }}
        error={manualImportError}
        onSubmit={handleManualImportSubmit}
      />
      
      <EditJsonDialog 
        open={editJsonDialogOpen}
        onOpenChange={setEditJsonDialogOpen}
        jsonData={editJsonData}
        onJsonDataChange={(value) => {
          setEditJsonData(value);
          setEditJsonError('');
        }}
        error={editJsonError}
        onSave={handleSaveEditedJson}
      />
      
      <VersionNameDialog 
        open={versionNameDialogOpen}
        onOpenChange={setVersionNameDialogOpen}
        versionName={versionName}
        onVersionNameChange={setVersionName}
        isEditing={currentVersionId !== null}
        onCancel={handleCancelVersionName}
        onConfirm={currentVersionId ? handleConfirmUpdateVersionName : handleConfirmSaveVersion}
      />
      
      <ConfirmationDialogs 
        deleteId={confirmDeleteId}
        onDeleteCancel={() => setConfirmDeleteId(null)}
        onDeleteConfirm={handleConfirmDelete}
        restoreId={confirmRestoreId}
        onRestoreCancel={() => setConfirmRestoreId(null)}
        onRestoreConfirm={handleConfirmRestore}
      />
    </div>
  );
};

export default Settings;
