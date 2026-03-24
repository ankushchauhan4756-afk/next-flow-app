'use client';

import { useState } from 'react';
import { Type, Image, Video, Zap, Crop as CropIcon, Film, Search, Menu } from 'lucide-react';

interface LeftSidebarProps {
  onAddNode: (type: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const QUICK_ACCESS_NODES = [
  { id: 'text', label: 'Text', icon: Type, color: 'text-blue-400' },
  { id: 'image', label: 'Image', icon: Image, color: 'text-green-400' },
  { id: 'video', label: 'Video', icon: Video, color: 'text-purple-400' },
  { id: 'llm', label: 'LLM', icon: Zap, color: 'text-yellow-400' },
  { id: 'crop', label: 'Crop', icon: CropIcon, color: 'text-orange-400' },
  { id: 'extractFrame', label: 'Frame', icon: Film, color: 'text-pink-400' },
];

export default function LeftSidebar({
  onAddNode,
  isCollapsed = false,
  onToggleCollapse,
}: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = QUICK_ACCESS_NODES.filter((node) =>
    node.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`bg-krea-dark border-r border-krea-accent/20 transition-all duration-300 flex flex-col h-full ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-krea-accent/20 flex items-center justify-between">
        {!isCollapsed && (
          <h3 className="text-sm font-semibold text-white">Nodes</h3>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-krea-darker rounded-lg transition-colors"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          <Menu size={18} className="text-krea-accent" />
        </button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-krea-accent/20">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 text-sm"
            />
          </div>
        </div>
      )}

      {/* Quick Access Buttons */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-2`}>
        {isCollapsed ? (
          // Collapsed view - icon buttons only
          <div className="space-y-2 flex flex-col items-center">
            {QUICK_ACCESS_NODES.map((node) => {
              const Icon = node.icon;
              return (
                <button
                  key={node.id}
                  onClick={() => onAddNode(node.id)}
                  className="p-3 rounded-lg bg-krea-darker hover:bg-krea-accent/20 transition-colors group relative"
                  title={node.label}
                >
                  <Icon size={20} className={node.color} />
                  <div className="absolute left-full ml-2 px-3 py-1 bg-krea-darker border border-krea-accent/30 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {node.label}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          // Expanded view - full buttons with labels
          <>
            <div className="text-xs font-semibold text-gray-400 uppercase px-2 mb-3">
              Quick Access
            </div>
            <div className="space-y-2">
              {filteredNodes.map((node) => {
                const Icon = node.icon;
                return (
                  <button
                    key={node.id}
                    onClick={() => onAddNode(node.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-krea-darker hover:bg-krea-accent/20 transition-colors group"
                  >
                    <Icon size={18} className={node.color} />
                    <span className="text-sm text-white group-hover:text-krea-accent transition-colors">
                      {node.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredNodes.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No nodes found</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      {!isCollapsed && (
        <div className="p-4 border-t border-krea-accent/20 space-y-2 text-xs text-gray-400">
          <p>💡 Tip: Drag nodes or click to add</p>
          <p>🔗 Connect handles to chain operations</p>
        </div>
      )}
    </div>
  );
}
