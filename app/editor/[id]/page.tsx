'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactFlow, {
  Node,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from '@/components/nodes';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import { buildExecutionGraph, isDAG } from '@/lib/execution';
import { Save, Play, Trash2, Download } from 'lucide-react';
import type { WorkflowRun } from '@prisma/client';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params.id as string;

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string>();
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

  // Load workflow on mount
  useEffect(() => {
    const loadWorkflow = async () => {
      try {
        const response = await fetch(`/api/workflows/${workflowId}`);
        if (response.ok) {
          const workflow = await response.json();
          setWorkflowName(workflow.name);
          setWorkflowDescription(workflow.description);
          setNodes(workflow.nodes || []);
          setEdges(workflow.edges || []);
        }
      } catch (error) {
        console.error('Error loading workflow:', error);
      }
    };

    loadWorkflow();
  }, [workflowId, setNodes, setEdges]);

  // Load execution history
  useEffect(() => {
    const loadRuns = async () => {
      try {
        const response = await fetch(`/api/workflows/${workflowId}/runs`);
        if (response.ok) {
          const data = await response.json();
          setRuns(data);
        }
      } catch (error) {
        console.error('Error loading runs:', error);
      }
    };

    loadRuns();
  }, [workflowId]);

  // Save workflow
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workflowName,
          description: workflowDescription,
          nodes,
          edges,
        }),
      });

      if (response.ok) {
        alert('Workflow saved successfully!');
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  }, [workflowId, workflowName, workflowDescription, nodes, edges]);

  // Execute workflow
  const handleExecute = useCallback(async () => {
    if (nodes.length === 0) {
      alert('Add nodes to your workflow first');
      return;
    }

    // Validate DAG
    const graph = buildExecutionGraph(nodes, edges);
    if (!isDAG(graph)) {
      alert('Workflow contains circular dependencies!');
      return;
    }

    setIsExecuting(true);
    try {
      const response = await fetch(`/api/workflows/${workflowId}/runs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope: 'full',
          workflowData: { nodes, edges },
        }),
      });

      if (response.ok) {
        const run = await response.json();
        setRuns([run, ...runs]);
        setSelectedRunId(run.id);
        // Auto-refresh runs
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Error executing workflow:', error);
      alert('Failed to execute workflow');
    } finally {
      setIsExecuting(false);
    }
  }, [nodes, edges, workflowId, runs]);

  // Delete workflow
  const handleDelete = useCallback(async () => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error deleting workflow:', error);
      alert('Failed to delete workflow');
    }
  }, [workflowId, router]);

  // Add node
  const handleAddNode = useCallback(
    (type: string) => {
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position: { x: Math.random() * 250, y: Math.random() * 250 },
        data: {},
      };
      setNodes((nodes) => [...nodes, newNode]);
    },
    [setNodes]
  );

  // Connect edges
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((edges) => addEdge(connection, edges));
    },
    [setEdges]
  );

  // Export workflow
  const handleExport = useCallback(() => {
    const workflow = {
      name: workflowName,
      description: workflowDescription,
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(workflow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [workflowName, workflowDescription, nodes, edges]);

  return (
    <div className="flex h-screen bg-krea-bg">
      {/* Left Sidebar */}
      <LeftSidebar
        onAddNode={handleAddNode}
        isCollapsed={leftSidebarCollapsed}
        onToggleCollapse={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-krea-dark border-b border-krea-accent/20 px-6 py-4 flex items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-2xl font-bold text-white bg-transparent focus:outline-none mb-2 w-full"
            />
            <input
              type="text"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Add a description..."
              className="text-sm text-gray-400 bg-transparent focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="btn btn-secondary"
              title="Export as JSON"
            >
              <Download size={18} />
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-secondary"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleExecute}
              disabled={isExecuting || nodes.length === 0}
              className="btn btn-primary"
            >
              <Play size={18} />
              {isExecuting ? 'Running...' : 'Execute'}
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-secondary text-red-400 hover:text-red-300"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn btn-secondary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#6366f11a" gap={12} size={1} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar
        runs={runs}
        selectedRunId={selectedRunId}
        onSelectRun={setSelectedRunId}
        isCollapsed={rightSidebarCollapsed}
        onToggleCollapse={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
      />
    </div>
  );
}
