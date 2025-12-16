import React, { useState } from 'react';
import { Copy, CheckIcon, TrashIcon } from 'lucide-react';
;

interface HistoryItemProps {
  item: {
    id: string;
    longUrl: string;
    shortUrl: string;
    clickCount: string;
  }; 

  onDelete: (id: string) => void;
}
const HistoryItem:React.FC<HistoryItemProps> = ({ item, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="group animate-slide-up relative flex  gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-slate-700 hover:bg-slate-800/50 md:flex-row md:items-center md:justify-between">
      {/* Link Information Section */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <a 
            href={item.shortUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="truncate text-lg font-bold text-cyan-400 hover:underline"
          >
            {item.shortUrl}
          </a>
          <span className="hidden rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400 md:inline-block">
            {item.clickCount} clicks
          </span>
        </div>
        <p className="truncate text-sm text-slate-500" title={item.longUrl}>
          {item.longUrl}
        </p>
      </div>
      
      {/* Actions Section (Copy & Delete) */}
      <div className="flex items-center gap-2">
        <button 
          
          onClick={handleCopy} 
          className="w-full md:w-auto min-w-[100px] flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700/80"
        >
          {copied ? (
            <>
              <CheckIcon className="mr-2 h-4 w-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" /> Copy
            </>
          )}
        </button>
        <button 
          onClick={() => onDelete(item.id)}
          className="rounded-lg p-3 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
          title="Delete"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}; 
 
export default HistoryItem;