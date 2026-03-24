'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Crop as CropIcon } from 'lucide-react';

interface CropImageNodeProps {
  data: {
    imageUrl?: string;
    xPercent?: number;
    yPercent?: number;
    widthPercent?: number;
    heightPercent?: number;
    croppedImageUrl?: string;
    isExecuting?: boolean;
    onXChange?: (value: number) => void;
    onYChange?: (value: number) => void;
    onWidthChange?: (value: number) => void;
    onHeightChange?: (value: number) => void;
    onExecute?: () => Promise<void>;
  };
  selected?: boolean;
}

const CropImageNodeComponent = memo(function CropImageNode({ data, selected }: CropImageNodeProps) {
  const handleNumberInput = (value: string, max: number) => {
    const num = parseInt(value) || 0;
    return Math.min(Math.max(num, 0), max);
  };

  return (
    <div
      className={`w-80 bg-krea-dark border-2 rounded-lg p-4 transition-all ${
        selected ? 'border-krea-accent shadow-lg shadow-krea-accent/50' : 'border-krea-accent/30'
      } ${data.isExecuting ? 'animate-pulse-glow' : ''}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <CropIcon size={16} className="text-krea-accent" />
        <span className="text-sm font-semibold text-white">Crop Image</span>
      </div>

      {/* Preview */}
      {(data.imageUrl || data.croppedImageUrl) && (
        <div className="mb-3 p-2 bg-krea-darker/50 rounded-lg">
          <img
            src={data.croppedImageUrl || data.imageUrl}
            alt="Preview"
            className="w-full h-24 object-cover rounded"
          />
        </div>
      )}

      {/* Crop Parameters Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="text-xs font-medium text-gray-400 block mb-1">X %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={data.xPercent || 0}
            onChange={(e) => data.onXChange?.(handleNumberInput(e.target.value, 100))}
            disabled={data.isExecuting}
            className="input text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-400 block mb-1">Y %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={data.yPercent || 0}
            onChange={(e) => data.onYChange?.(handleNumberInput(e.target.value, 100))}
            disabled={data.isExecuting}
            className="input text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-400 block mb-1">Width %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={data.widthPercent || 100}
            onChange={(e) => data.onWidthChange?.(handleNumberInput(e.target.value, 100))}
            disabled={data.isExecuting}
            className="input text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-400 block mb-1">Height %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={data.heightPercent || 100}
            onChange={(e) => data.onHeightChange?.(handleNumberInput(e.target.value, 100))}
            disabled={data.isExecuting}
            className="input text-xs"
          />
        </div>
      </div>

      {/* Execute Button */}
      <button
        onClick={data.onExecute}
        disabled={data.isExecuting || !data.imageUrl}
        className="w-full btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {data.isExecuting ? 'Processing...' : 'Crop'}
      </button>

      {/* Input Handle */}
      <Handle type="target" position={Position.Left} id="image_url" />
      <Handle type="target" position={Position.Left} id="x_percent" />
      <Handle type="target" position={Position.Left} id="y_percent" />
      <Handle type="target" position={Position.Left} id="width_percent" />
      <Handle type="target" position={Position.Left} id="height_percent" />

      {/* Output */}
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
});

export default CropImageNodeComponent;
