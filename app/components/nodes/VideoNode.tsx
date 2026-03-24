'use client';

import { memo, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Upload, Video } from 'lucide-react';

interface VideoNodeProps {
  data: {
    videoUrl?: string;
    fileName?: string;
    isUploading?: boolean;
    onUpload?: (file: File) => Promise<void>;
  };
  selected?: boolean;
}

const VideoNodeComponent = memo(function VideoNode({ data, selected }: VideoNodeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && data.onUpload) {
      await data.onUpload(file);
    }
  };

  const supportedFormats = ['mp4', 'mov', 'webm', 'm4v'];

  return (
    <div
      className={`w-72 bg-krea-dark border-2 rounded-lg p-4 transition-all ${
        selected ? 'border-krea-accent shadow-lg shadow-krea-accent/50' : 'border-krea-accent/30'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Video size={16} className="text-krea-accent" />
        <span className="text-sm font-semibold text-white">Upload Video</span>
      </div>

      {data.videoUrl ? (
        <div className="mb-3">
          <video
            src={data.videoUrl}
            controls
            className="w-full h-32 bg-black rounded-lg mb-2"
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

export default VideoNodeComponent;
