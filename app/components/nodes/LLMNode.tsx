'use client';

import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Zap, ChevronDown } from 'lucide-react';

interface LLMNodeProps {
  data: {
    model?: string;
    systemPrompt?: string;
    userMessage?: string;
    response?: string;
    isExecuting?: boolean;
    onModelChange?: (model: string) => void;
    onSystemPromptChange?: (prompt: string) => void;
    onUserMessageChange?: (message: string) => void;
    onExecute?: () => Promise<void>;
  };
  selected?: boolean;
}

const GEMINI_MODELS = [
  'gemini-pro',
  'gemini-pro-vision',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
];

const LLMNodeComponent = memo(function LLMNode({ data, selected }: LLMNodeProps) {
  const [showModels, setShowModels] = useState(false);
  const [expandResponse, setExpandResponse] = useState(false);

  return (
    <div
      className={`w-80 bg-krea-dark border-2 rounded-lg p-4 transition-all ${
        selected ? 'border-krea-accent shadow-lg shadow-krea-accent/50' : 'border-krea-accent/30'
      } ${data.isExecuting ? 'animate-pulse-glow' : ''}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Zap size={16} className="text-krea-accent" />
        <span className="text-sm font-semibold text-white">LLM Node</span>
      </div>

      {/* Model Selector */}
      <div className="relative mb-3">
        <label className="text-xs font-medium text-gray-400 block mb-1">Model</label>
        <button
          onClick={() => setShowModels(!showModels)}
          className="w-full px-3 py-2 bg-krea-darker border border-krea-accent/30 rounded-lg text-sm text-white flex items-center justify-between hover:border-krea-accent/50 transition-colors"
        >
          <span>{data.model || 'Select model...'}</span>
          <ChevronDown size={16} />
        </button>

        {showModels && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-krea-darker border border-krea-accent/30 rounded-lg z-10">
            {GEMINI_MODELS.map((model) => (
              <button
                key={model}
                onClick={() => {
                  data.onModelChange?.(model);
                  setShowModels(false);
                }}
                className="w-full px-3 py-2 text-sm text-left text-gray-300 hover:bg-krea-accent/20 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                {model}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* System Prompt */}
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-400 block mb-1">System Prompt (optional)</label>
        <textarea
          value={data.systemPrompt || ''}
          onChange={(e) => data.onSystemPromptChange?.(e.target.value)}
          placeholder="Optional system context..."
          className="input text-xs resize-none h-16"
          disabled={data.isExecuting}
        />
      </div>

      {/* User Message */}
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-400 block mb-1">User Message</label>
        <textarea
          value={data.userMessage || ''}
          onChange={(e) => data.onUserMessageChange?.(e.target.value)}
          placeholder="Type your message..."
          className="input text-xs resize-none h-16"
          disabled={data.isExecuting}
        />
      </div>

      {/* Response */}
      {data.response && (
        <div className="mb-3 p-3 bg-krea-darker/50 rounded-lg border border-krea-accent/20">
          <button
            onClick={() => setExpandResponse(!expandResponse)}
            className="text-xs font-medium text-krea-accent mb-2 hover:text-krea-accent-light"
          >
            {expandResponse ? '▼ Response' : '▶ Response'}
          </button>
          {expandResponse && (
            <p className="text-xs text-gray-300 text-wrap break-words">{data.response}</p>
          )}
        </div>
      )}

      {/* Execute Button */}
      <button
        onClick={data.onExecute}
        disabled={data.isExecuting || !data.userMessage}
        className="w-full btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {data.isExecuting ? 'Executing...' : 'Run'}
      </button>

      {/* Input Handles */}
      <Handle type="target" position={Position.Left} id="system_prompt" />
      <Handle type="target" position={Position.Left} id="user_message" />
      <Handle type="target" position={Position.Left} id="images" />

      {/* Output */}
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
});

export default LLMNodeComponent;
