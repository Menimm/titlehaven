
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import JsonEditing from './JsonEditing';
import VersionManagement from './VersionManagement';
import { BackupVersion } from '@/lib/types';

interface AdvancedSectionProps {
  expanded: boolean;
  onToggle: () => void;
  versions: BackupVersion[];
  onEditJson: () => void;
  onSaveVersion: () => void;
  onEditVersionName: (id: string, name: string) => void;
  onDownloadVersion: (version: BackupVersion) => void;
  onRequestRestore: (id: string) => void;
  onRequestDelete: (id: string) => void;
}

const AdvancedSection = ({
  expanded,
  onToggle,
  versions,
  onEditJson,
  onSaveVersion,
  onEditVersionName,
  onDownloadVersion,
  onRequestRestore,
  onRequestDelete
}: AdvancedSectionProps) => {
  return (
    <div className="bg-card rounded-lg border shadow p-6 mb-8">
      <button
        className="w-full flex items-center justify-between"
        onClick={onToggle}
      >
        <h2 className="text-xl font-semibold">Advanced Options</h2>
        {expanded ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      
      {expanded && (
        <div className="mt-4 space-y-6">
          <JsonEditing onEditJson={onEditJson} />
          
          <VersionManagement 
            versions={versions}
            onSaveVersion={onSaveVersion}
            onEditVersionName={onEditVersionName}
            onDownloadVersion={onDownloadVersion}
            onRequestRestore={onRequestRestore}
            onRequestDelete={onRequestDelete}
          />
        </div>
      )}
    </div>
  );
};

export default AdvancedSection;
