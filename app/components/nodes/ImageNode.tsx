'use client';

import { memo, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageNodeProps {
  data: {
    imageUrl?: string;
    fileName?: string;
    isUploading?: boolean;
    onUpload?: (file: File) => Promise<void>;
  };
  selected?: boolean;
}

const ImageNodeComponent = memo(function ImageNode({ data, selected }: ImageNodeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && data.onUpload) {
      await data.onUpload(file);
    }
  };

  const supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

  return (
    <div
      className={`w-72 bg-krea-dark border-2 rounded-lg p-4 transition-all ${
        selected ? 'border-krea-accent shadow-lg shadow-krea-accent/50' : 'border-krea-accent/30'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <ImageIcon size={16} className="text-krea-accent" />
        <span className="text-sm font-semibold text-white">Upload Image</span>
      </div>

      {data.imageUrl ? (
        <div className="mb-3">
          <img 
            src={data.imageUrl} 
            alt="Preview" 
            className="w-full h-32 object-cover rounded-lg mb-2"
          />
          <p className="text-xs text-gray-400 truncate">{data.fileName}</p>
        </div>
      ) : (
        <div
          className="w-full h-32 border-2 border-dashed border-krea-accent/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-krea-accent/50 transition-colors mb-3 bg-krea-darker/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            <Upload size={20} className="mx-auto text-gray-400 mb-1" />
            <p className="text-xs text-gray-400">Click to upload</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={supportedFormats.map(f => `.${f}`).join(',')}
        onChange={handleFileSelect}
        disabled={data.isUploading}
        className="hidden"
      />

      <div className="text-xs text-gray-500 mb-3">
        Formats: {supportedFormats.join(', ')}
      </div>

      {data.isUploading && (
        <div className="text-xs text-krea-accent mb-2">Uploading...</div>
      )}

      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
});

export default ImageNodeComponent;
