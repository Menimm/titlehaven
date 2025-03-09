
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Save, Download, Edit, RotateCcw, Trash2, ChevronDown } from 'lucide-react';
import { BackupVersion } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VersionManagementProps {
  versions: BackupVersion[];
  onSaveVersion: () => void;
  onEditVersionName: (id: string, name: string) => void;
  onDownloadVersion: (version: BackupVersion) => void;
  onRequestRestore: (id: string) => void;
  onRequestDelete: (id: string) => void;
}

const VersionManagement = ({
  versions,
  onSaveVersion,
  onEditVersionName,
  onDownloadVersion,
  onRequestRestore,
  onRequestDelete
}: VersionManagementProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Version Management</h3>
        <Button
          onClick={onSaveVersion}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Current Version
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Save multiple versions of your bookmarks and easily switch between them.
      </p>
      
      {versions.length === 0 ? (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">No saved versions yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {versions.map(version => (
            <div 
              key={version.id} 
              className="p-3 border rounded-md flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{version.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(version.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <span className="sr-only">Actions</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onEditVersionName(version.id, version.name)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownloadVersion(version)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onRequestRestore(version.id)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onRequestDelete(version.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionManagement;
