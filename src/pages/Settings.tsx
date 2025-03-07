
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useCategories } from '@/hooks/useCategories';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const Settings = () => {
  const navigate = useNavigate();
  const { bookmarks } = useBookmarks();
  const { categories } = useCategories();
  const { settings } = useAppSettings();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [manualImportData, setManualImportData] = useState('');
  const [manualImportError, setManualImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Start file import
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
                onClick={handleExport}
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
                  onClick={handleManualImport}
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
        
        <div className="bg-card rounded-lg border shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Data Format</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The backup file is in JSON format and can be edited with any text editor. Here's an example of the structure:
          </p>
          <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-96">
{`{
  "version": 1,
  "timestamp": "2023-08-15T12:34:56.789Z",
  "data": {
    "bookmarks": [
      {
        "id": "abc123",
        "title": "Example Website",
        "url": "https://example.com",
        "description": "This is an example bookmark",
        "category": "default",
        "favicon": "https://www.google.com/s2/favicons?domain=example.com",
        "createdAt": "2023-08-10T10:20:30.456Z"
      }
    ],
    "categories": [
      {
        "id": "default",
        "name": "General",
        "order": 0,
        "visible": true,
        "color": "#f0f0f0"
      }
    ],
    "settings": {
      "backgroundColor": "#ffffff"
    }
  }
}`}
          </pre>
        </div>
      </div>
      
      {/* Manual Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Import from JSON</DialogTitle>
            <DialogDescription>
              Paste your JSON backup data below. Make sure it follows the correct format.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea 
              value={manualImportData}
              onChange={(e) => {
                setManualImportData(e.target.value);
                setManualImportError('');
              }}
              placeholder="Paste JSON backup data here..."
              className="min-h-[300px] font-mono text-sm"
            />
            {manualImportError && (
              <p className="text-destructive text-sm mt-2">{manualImportError}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleManualImportSubmit}>
              Import Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
