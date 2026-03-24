'use client';

import { useState } from 'react';
import { ChevronDown, Menu, Clock, CheckCircle, AlertCircle, Clock3 } from 'lucide-react';
import type { WorkflowRun } from '@prisma/client';

interface RightSidebarProps {
  runs: WorkflowRun[];
  selectedRunId?: string;
  onSelectRun?: (runId: string) => void;
  onExpandRun?: (runId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function RightSidebar({
  runs = [],
  selectedRunId,
  onSelectRun,
  onExpandRun,
  isCollapsed = false,
  onToggleCollapse,
}: RightSidebarProps) {
  const [expandedRuns, setExpandedRuns] = useState<Set<string>>(new Set());

  const toggleExpanded = (runId: string) => {
    const next = new Set(expandedRuns);
    if (next.has(runId)) {
      next.delete(runId);
    } else {
      next.add(runId);
    }
    setExpandedRuns(next);
    onExpandRun?.(runId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'failed':
        return <AlertCircle size={16} className="text-red-400" />;
      case 'running':
        return <Clock3 size={16} className="text-yellow-400 animate-spin" />;
      case 'partial':
        return <AlertCircle size={16} className="text-orange-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'running':
        return 'text-yellow-400';
      case 'partial':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div
      className={`bg-krea-dark border-l border-krea-accent/20 transition-all duration-300 flex flex-col h-full ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-krea-accent/20 flex items-center justify-between">
        {!isCollapsed && (
          <h3 className="text-sm font-semibold text-white">History</h3>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-krea-darker rounded-lg transition-colors"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          <Menu size={18} className="text-krea-accent" />
        </button>
      </div>

      {/* Runs List */}
      <div className="flex-1 overflow-y-auto">
        {!isCollapsed ? (
          <>
            {runs.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <p className="text-sm">No runs yet</p>
                <p className="text-xs mt-2">Execute a workflow to see history</p>
              </div>
            ) : (
              <div className="divide-y divide-krea-accent/10 p-2">
                {runs.map((run) => (
                  <div key={run.id}>
                    {/* Run Header */}
                    <button
                      onClick={() => onSelectRun?.(run.id)}
                      className={`w-full px-3 py-2 rounded-lg hover:bg-krea-darker/50 transition-colors text-left ${
                        selectedRunId === run.id ? 'bg-krea-accent/20' : ''
                      }`}
                    >
                      {/* Run Info */}
                      <div className="flex items-start gap-2 mb-1">
                        {getStatusIcon(run.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            Run #{run.id.slice(-8).toUpperCase()}
                          </p>
                          <p className={`text-xs ${getStatusColor(run.status)} capitalize`}>
                            {run.status}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpanded(run.id);
                          }}
                          className="p-1 hover:bg-krea-accent/20 rounded transition-colors"
                        >
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${
                              expandedRuns.has(run.id) ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Run Details */}
                      <div className="text-xs text-gray-400 ml-6 space-y-0.5">
                        <p>
                          {new Date(run.startedAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="capitalize">{run.scope} • {run.duration}ms</p>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {expandedRuns.has(run.id) && (
                      <div className="px-4 py-2 bg-krea-darker/50 text-xs text-gray-300 space-y-2 border-l-2 border-krea-accent/30 ml-2">
                        <div>
                          <p className="font-medium text-gray-400 mb-1">Scope</p>
                          <p className="capitalize">{run.scope}</p>
                        </div>
                        {run.error && (
                          <div>
                            <p className="font-medium text-red-400 mb-1">Error</p>
                            <p className="text-red-300 break-words">{run.error}</p>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-400 mb-1">Duration</p>
                          <p>{run.duration ? `${run.duration}ms` : 'Running...'}</p>
                        </div>
                        {run.completedAt && (
                          <div>
                            <p className="font-medium text-gray-400 mb-1">Completed</p>
                            <p>
                              {new Date(run.completedAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Collapsed view - show count badge
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <Clock size={24} className="text-krea-accent mb-2" />
            <p className="text-xs font-semibold text-white">{runs.length}</p>
            <p className="text-xs text-gray-400">runs</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-krea-accent/20 text-xs text-gray-400">
          <p>📊 Click a run to view details</p>
        </div>
      )}
    </div>
  );
}
