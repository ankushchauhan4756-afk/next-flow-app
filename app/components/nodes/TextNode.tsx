'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Type } from 'lucide-react';

interface TextNodeProps {
  data: {
    value?: string;
    onChange?: (value: string) => void;
  };
  selected?: boolean;
}

const TextNodeComponent = memo(function TextNode({ data, selected }: TextNodeProps) {
  return (
    <div
      className={`w-64 bg-krea-dark border-2 rounded-lg p-4 transition-all ${
        selected ? 'border-krea-accent shadow-lg shadow-krea-accent/50' : 'border-krea-accent/30'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Type size={16} className="text-krea-accent" />
        <span className="text-sm font-semibold text-white">Text</span>
      </div>
      
      <textarea
        value={data.value || ''}
        onChange={(e) => data.onChange?.(e.target.value)}
        placeholder="Enter your text..."
        className="input text-sm resize-none h-24 mb-3"
      />
      
      <div className="text-xs text-gray-400">
        {data.value?.length || 0} characters
      </div>

      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
});

export default TextNodeComponent;
