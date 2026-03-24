// Workflow execution engine
import type { Node, Edge } from 'reactflow';

interface ExecutionGraph {
  [nodeId: string]: {
    node: Node;
    dependencies: string[];
    dependents: string[];
  };
}

interface ExecutionOrder {
  batchIndex: number;
  nodeIds: string[];
}

/**
 * Build a dependency graph from nodes and edges
 */
export function buildExecutionGraph(nodes: Node[], edges: Edge[]): ExecutionGraph {
  const graph: ExecutionGraph = {};

  // Initialize all nodes
  nodes.forEach((node) => {
    graph[node.id] = {
      node,
      dependencies: [],
      dependents: [],
    };
  });

  // Add edge information
  edges.forEach((edge) => {
    if (edge.source && edge.target) {
      if (graph[edge.target]) {
        graph[edge.target].dependencies.push(edge.source);
      }
      if (graph[edge.source]) {
        graph[edge.source].dependents.push(edge.target);
      }
    }
  });

  return graph;
}

/**
 * Check if a node would create a cycle
 */
export function wouldCreateCycle(
  graph: ExecutionGraph,
  sourceId: string,
  targetId: string
): boolean {
  // BFS to find if there's a path from target to source
  const visited = new Set<string>();
  const queue = [targetId];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    if (current === sourceId) {
      return true;
    }

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);

    const dependents = graph[current]?.dependents || [];
    queue.push(...dependents);
  }

  return false;
}

/**
 * Validate DAG (Directed Acyclic Graph)
 */
export function isDAG(graph: ExecutionGraph): boolean {
  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    visited.add(nodeId);
    recStack.add(nodeId);

    const dependents = graph[nodeId]?.dependents || [];
    for (const dependent of dependents) {
      if (!visited.has(dependent)) {
        if (hasCycle(dependent)) {
          return true;
        }
      } else if (recStack.has(dependent)) {
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  }

  for (const nodeId in graph) {
    if (!visited.has(nodeId)) {
      if (hasCycle(nodeId)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Get execution order for parallel execution
 * Returns batches where nodes in same batch have no dependencies on each other
 */
export function getExecutionOrder(
  graph: ExecutionGraph,
  selectedNodeIds?: string[]
): ExecutionOrder[] {
  const nodes = selectedNodeIds
    ? Object.values(graph).filter((g) => selectedNodeIds.includes(g.node.id))
    : Object.values(graph);

  const executed = new Set<string>();
  const batches: ExecutionOrder[] = [];
  let batchIndex = 0;

  while (executed.size < nodes.length) {
    const batch: string[] = [];

    for (const { node, dependencies } of nodes) {
      if (executed.has(node.id)) continue;

      // Check if all dependencies have been executed
      const allDependenciesMet = dependencies.every((depId) => executed.has(depId));

      if (allDependenciesMet) {
        batch.push(node.id);
      }
    }

    if (batch.length === 0) {
      throw new Error('Circular dependency detected in workflow');
    }

    batches.push({
      batchIndex,
      nodeIds: batch,
    });

    batch.forEach((nodeId) => executed.add(nodeId));
    batchIndex++;
  }

  return batches;
}

/**
 * Get only the selected nodes and their dependencies
 */
export function getSelectedNodeTree(
  graph: ExecutionGraph,
  selectedNodeIds: string[]
): ExecutionGraph {
  const tree: ExecutionGraph = {};
  const queue = [...selectedNodeIds];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId || visited.has(nodeId)) continue;

    visited.add(nodeId);
    const graphNode = graph[nodeId];

    if (graphNode) {
      tree[nodeId] = graphNode;
      queue.push(...graphNode.dependencies);
    }
  }

  return tree;
}

/**
 * Export workflow to JSON
 */
export function exportWorkflow(
  name: string,
  description: string,
  nodes: Node[],
  edges: Edge[]
): string {
  const workflow = {
    version: '1.0.0',
    name,
    description,
    createdAt: new Date().toISOString(),
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    })),
  };

  return JSON.stringify(workflow, null, 2);
}

/**
 * Import workflow from JSON
 */
export function importWorkflow(json: string): {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
} {
  const workflow = JSON.parse(json);

  if (!workflow.version || !workflow.nodes || !workflow.edges) {
    throw new Error('Invalid workflow format');
  }

  return {
    name: workflow.name || 'Imported Workflow',
    description: workflow.description || '',
    nodes: workflow.nodes,
    edges: workflow.edges,
  };
}
