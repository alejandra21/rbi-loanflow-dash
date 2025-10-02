import React from 'react';

interface JsonViewerProps {
  data: any;
  title?: string;
}

export const JsonViewer = ({ data, title = "Raw Output" }: JsonViewerProps) => {

  const renderValue = (value: any, key: string, depth: number = 0): JSX.Element => {
    const indent = depth * 16;

    if (value === null) {
      return <span className="text-muted-foreground">null</span>;
    }

    if (typeof value === 'boolean') {
      return <span className="text-blue-600">{value.toString()}</span>;
    }

    if (typeof value === 'number') {
      return <span className="text-green-600">{value}</span>;
    }

    if (typeof value === 'string') {
      return <span className="text-orange-600">"{value}"</span>;
    }

    if (Array.isArray(value)) {
      return (
        <div style={{ marginLeft: indent }}>
          <span className="text-muted-foreground">[</span>
          {value.map((item, index) => (
            <div key={index} className="ml-4">
              {renderValue(item, index.toString(), depth + 1)}
              {index < value.length - 1 && <span className="text-muted-foreground">,</span>}
            </div>
          ))}
          <span className="text-muted-foreground">]</span>
        </div>
      );
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value);
      return (
        <div style={{ marginLeft: indent }}>
          <span className="text-muted-foreground">{'{'}</span>
          {entries.map(([objKey, objValue], index) => (
            <div key={objKey} className="ml-4">
              <span className="text-purple-600">"{objKey}"</span>
              <span className="text-muted-foreground">: </span>
              {renderValue(objValue, objKey, depth + 1)}
              {index < entries.length - 1 && <span className="text-muted-foreground">,</span>}
            </div>
          ))}
          <span className="text-muted-foreground">{'}'}</span>
        </div>
      );
    }

    return <span>{String(value)}</span>;
  };

  if (!data) return null;

  return (
    <div className="border rounded-md">
      <div className="p-4 bg-slate-50 dark:bg-slate-900 font-mono text-sm overflow-x-auto">
        {renderValue(data, 'root')}
      </div>
    </div>
  );
};