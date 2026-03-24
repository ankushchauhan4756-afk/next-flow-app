'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Film } from 'lucide-react';

interface ExtractFrameNodeProps {
  data: {
    videoUrl?: string;
    timestamp?: string;
    extractedFrameUrl?: string;
    isExecuting?: boolean;
    onTimestampChange?: (value: string) => void;
    onExecute?: () => Promise<void>;
  };
  selected?: boolean;
}

const ExtractFrameNodeComponent = memo(function ExtractFrameNode({ data, selected }: ExtractFrameNodeProps) {
  const isPercentage = data.timestamp?.includes('%') || false;

  return (
    <div
      className={`w-80 bg-krea-dark border-2 rounded-lg p-4 transition-all ${
        selected ? 'border-krea-accent shadow-lg shadow-krea-accent/50' : 'border-krea-accent/30'
      } ${data.isExecuting ? 'animate-pulse-glow' : ''}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Film size={16} className="text-krea-accent" />
        <span className="text-sm font-semibold text-white">Extract Frame</span>
      </div>

      {/* Extracted Frame Preview */}
      {data.extractedFrameUrl && (
        <div className="mb-3 p-2 bg-krea-darker/50 rounded-lg">
          <img
            src={data.extractedFrameUrl}
            alt="Extracted Frame"
            className="w-full h-24 object-cover rounded"
          />
          <p className="text-xs text-gray-400 mt-2">Extracted frame</p>
        </div>
      )}

      {/* Timestamp Input */}
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-400 block mb-2">
          Timestamp {isPercentage ? '(%)' : '(seconds)'}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={data.timestamp || '0'}
            onChange={(e) => data.onTimestampChange?.(e.target.value)}
            placeholder="0 or 50%"
            className="input text-xs flex-1"
            disabled={data.isExecuting}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Enter seconds (e.g., 5) or percentage (e.g., 50%)
        </p>
      </div>

      {/* Execute Button */}
      <button
        onClick={data.onExecute}
        disabled={data.isExecuting || !data.videoUrl}
        className="w-full btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {data.isExecuting ? 'Extracting...' : 'Extract'}
      </button>

      {/* Input Handles */}
      <Handle type="target" position={Position.Left} id="video_url" />
      <Handle type="target" position={Position.Left} id="timestamp" />

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
});

export default ExtractFrameNodeComponent;
