
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useCategories } from '@/hooks/useCategories';
import { useAppSettings } from '@/hooks/useAppSettings';

interface BackupRestoreSectionProps {
  onManualImport: () => void;
  onExport: () => void;
}

const BackupRestoreSection = ({ onManualImport, onExport }: BackupRestoreSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file import button click
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Process imported file
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        processImportData(result);
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Failed to read backup file');
      }
    };
    reader.readAsText(file);
    
    // Clear the input to allow re-importing the same file
    if (event.target) {
      event.target.value = '';
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

  return (
    <div className="bg-card rounded-lg border shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Backup and Restore</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Export your bookmarks and settings to a file that you can save as a backup or use to transfer to another device.
        You can also edit the JSON file manually to add or modify bookmarks before importing.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Backup</h3>
          <p className="text-sm text-muted-foreground">
            Export all your bookmarks, categories, and settings to a JSON file.
          </p>
          <Button 
            onClick={onExport}
            className="w-full flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export to File
          </Button>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Restore</h3>
          <p className="text-sm text-muted-foreground">
            Import bookmarks, categories, and settings from a backup file.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={handleImportClick}
              variant="default"
              className="w-full flex items-center justify-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Import from File
            </Button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              className="hidden"
            />
            <Button 
              onClick={onManualImport}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Paste JSON Data
            </Button>
          </div>
        </div>
      </div>
      
      <Alert className="mt-6">
        <AlertDescription>
          Note: Importing a backup will replace all existing bookmarks, categories, and settings. 
          Make sure to export a backup of your current data first if needed.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default BackupRestoreSection;
