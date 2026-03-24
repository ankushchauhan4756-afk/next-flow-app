import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';

interface WorkflowStore {
  nodes: Node[];
  edges: Edge[];
  selectedNodes: string[];
  isExecuting: boolean;
  executingNodes: Set<string>;

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNodes: (nodeIds: string[]) => void;
  setIsExecuting: (executing: boolean) => void;
  setExecutingNode: (nodeId: string, executing: boolean) => void;

  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;

  addEdge: (edge: Edge) => void;
  removeEdge: (edgeId: string) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: [],
  edges: [],
  selectedNodes: [],
  isExecuting: false,
  executingNodes: new Set(),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNodes: (nodeIds) => set({ selectedNodes: nodeIds }),
  setIsExecuting: (executing) => set({ isExecuting: executing }),
  setExecutingNode: (nodeId, executing) =>
    set((state) => {
      const newExecuting = new Set(state.executingNodes);
      if (executing) {
        newExecuting.add(nodeId);
      } else {
        newExecuting.delete(nodeId);
      }
      return { executingNodes: newExecuting };
    }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    })),

  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)),
    })),

  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== edgeId),
    })),
}));
