
import React from 'react';

const DataFormatSection = () => {
  return (
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
  );
};

export default DataFormatSection;
