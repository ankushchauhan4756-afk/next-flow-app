'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load workflows on mount
  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        const response = await fetch('/api/workflows');
        if (response.ok) {
          const data = await response.json();
          setWorkflows(data);
        }
      } catch (error) {
        console.error('Error loading workflows:', error);
      }
    };
    loadWorkflows();
  }, []);

  const handleCreateWorkflow = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Workflow ${Date.now()}`,
          description: 'New workflow',
          nodes: [],
          edges: [],
        }),
      });

      if (response.ok) {
        const workflow = await response.json();
        setWorkflows([...workflows, workflow]);
        router.push(`/editor/${workflow.id}`);
      } else {
        const error = await response.json();
        console.error('Error:', error);
        alert('Failed to create workflow: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Failed to create workflow'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkflow = async (e: React.MouseEvent, workflowId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWorkflows(workflows.filter(w => w.id !== workflowId));
      } else {
        alert('Failed to delete workflow');
      }
    } catch (error) {
      console.error('Error deleting workflow:', error);
      alert('Error deleting workflow');
    }
  }

  return (
    <div className="min-h-screen bg-krea-bg">
      {/* Header */}
      <div className="border-b border-krea-accent/20 bg-krea-dark">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">NextFlow</h1>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-krea-accent/20 transition-colors">
            <LogOut size={18} className="text-gray-400" />
            <span className="text-sm text-gray-400">Demo Mode</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Workflows</h2>
            <p className="text-gray-400">Create and manage your LLM workflows</p>
          </div>
          <button
            onClick={handleCreateWorkflow}
            disabled={loading}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Workflow
          </button>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 mb-4">No workflows yet</p>
              <button
                onClick={handleCreateWorkflow}
                disabled={loading}
                className="btn btn-primary"
              >
                Create Your First Workflow
              </button>
            </div>
          ) : (
            workflows.map((workflow) => (
              <div
                key={workflow.id}
                onClick={() => router.push(`/editor/${workflow.id}`)}
                className="card cursor-pointer hover:border-krea-accent/60 transition-colors relative group"
              >
                <h3 className="text-lg font-semibold text-white mb-1">
                  {workflow.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{workflow.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(workflow.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={(e) => handleDeleteWorkflow(e, workflow.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
