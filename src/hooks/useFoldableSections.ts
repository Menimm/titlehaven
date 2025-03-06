
import { useState, useEffect } from 'react';

export const useFoldableSections = (sections: string[]) => {
  // Initialize with stored preferences from localStorage or all expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('expandedSections');
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Make sure all current sections have a state (handle new sections)
        const initialState = { ...parsed };
        sections.forEach(section => {
          if (initialState[section] === undefined) {
            initialState[section] = true; // Default new sections to expanded
          }
        });
        
        return initialState;
      }
    } catch (e) {
      console.error('Failed to parse expandedSections from localStorage', e);
    }
    
    // Default state: all sections expanded
    return sections.reduce((acc, section) => {
      acc[section] = true;
      return acc;
    }, {} as Record<string, boolean>);
  });

  // Update expandedSections when sections change
  useEffect(() => {
    const newExpandedSections = { ...expandedSections };
    let changed = false;
    
    // Add any new sections
    sections.forEach(section => {
      if (newExpandedSections[section] === undefined) {
        newExpandedSections[section] = true; // Default new sections to expanded
        changed = true;
      }
    });
    
    // If there were changes, update the state
    if (changed) {
      setExpandedSections(newExpandedSections);
    }
  }, [sections]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('expandedSections', JSON.stringify(expandedSections));
  }, [expandedSections]);

  // Toggle section expanded/collapsed state
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Collapse all sections
  const collapseAll = () => {
    const allCollapsed = sections.reduce((acc, section) => {
      acc[section] = false;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedSections(allCollapsed);
  };

  // Expand all sections
  const expandAll = () => {
    const allExpanded = sections.reduce((acc, section) => {
      acc[section] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedSections(allExpanded);
  };

  return {
    expandedSections,
    toggleSection,
    collapseAll,
    expandAll
  };
};
