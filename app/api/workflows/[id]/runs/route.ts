import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildExecutionGraph, getExecutionOrder, isDAG } from '@/lib/execution';
import type { Node, Edge } from 'reactflow';

const DEMO_USER_ID = 'demo-user-123';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = DEMO_USER_ID; // Demo mode
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scope, selectedNodeIds, workflowData } = await request.json();
    const workflowId = params.id;

    // Verify workflow ownership
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        user: { clerkId: userId },
      },
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    const nodes = workflowData.nodes as Node[];
    const edges = workflowData.edges as Edge[];

    // Validate DAG
    const graph = buildExecutionGraph(nodes, edges);
    if (!isDAG(graph)) {
      return NextResponse.json(
        { error: 'Workflow contains circular dependencies' },
        { status: 400 }
      );
    }

    // Create run record
    const run = await prisma.workflowRun.create({
      data: {
        userId: workflow.userId,
        workflowId,
        status: 'running',
        scope,
        selectedNodeIds: selectedNodeIds && selectedNodeIds.length > 0 ? selectedNodeIds : undefined,
        startedAt: new Date(),
      },
    });

    // Get execution order
    let executionOrder;
    try {
      executionOrder = getExecutionOrder(
        graph,
        scope === 'partial' ? selectedNodeIds : undefined
      );
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to calculate execution order' },
        { status: 400 }
      );
    }

    // Start execution asynchronously
    executeWorkflow(run.id, workflowId, nodes, edges, executionOrder).catch(
      (error) => {
        console.error(`Error executing workflow ${workflowId}:`, error);
        // Update run status to failed
        prisma.workflowRun.update({
          where: { id: run.id },
          data: {
            status: 'failed',
            error: error.message,
            completedAt: new Date(),
          },
        }).catch(console.error);
      }
    );

    return NextResponse.json(run);
  } catch (error) {
    console.error('Error creating run:', error);
    return NextResponse.json(
      { error: 'Failed to create run' },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = DEMO_USER_ID; // Demo mode
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflowId = params.id;

    // Verify workflow ownership
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        user: { clerkId: userId },
      },
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    const runs = await prisma.workflowRun.findMany({
      where: { workflowId },
      include: {
        nodeRuns: true,
      },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(runs);
  } catch (error) {
    console.error('Error fetching runs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch runs' },
      { status: 500 }
    );
  }
}

/**
 * Execute workflow asynchronously
 */
async function executeWorkflow(
  runId: string,
  _workflowId: string,
  nodes: Node[],
  edges: Edge[],
  executionOrder: any[]
): Promise<void> {
  const startTime = Date.now();
  const nodeResults: Record<string, any> = {};
  let failed = false;

  try {
    // Execute batches sequentially
    for (const batch of executionOrder) {
      const batchStartTime = Date.now();

      // Create node runs for this batch
      const nodeRunPromises = batch.nodeIds.map((nodeId: string) => {
        return prisma.nodeRun.create({
          data: {
            runId,
            nodeId,
            nodeType: nodes.find((n) => n.id === nodeId)?.type || 'unknown',
            status: 'running',
            startedAt: new Date(),
          },
        });
      });

      const nodeRuns = await Promise.all(nodeRunPromises);

      // Execute nodes in parallel
      const executionPromises = batch.nodeIds.map(async (nodeId: string) => {
        const node = nodes.find((n) => n.id === nodeId);
        const nodeRun = nodeRuns.find((nr) => nr.nodeId === nodeId);

        if (!node || !nodeRun) return;

        try {
          const result = await executeNode(
            node,
            nodeResults,
            nodes,
            edges
          );

          nodeResults[nodeId] = result;

          // Update node run
          await prisma.nodeRun.update({
            where: { id: nodeRun.id },
            data: {
              status: 'success',
              outputs: JSON.stringify(result),
              completedAt: new Date(),
              duration: Date.now() - batchStartTime,
            },
          });
        } catch (error) {
          failed = true;

          await prisma.nodeRun.update({
            where: { id: nodeRun.id },
            data: {
              status: 'failed',
              error: error instanceof Error ? error.message : 'Unknown error',
              completedAt: new Date(),
              duration: Date.now() - batchStartTime,
            },
          });
        }
      });

      await Promise.all(executionPromises);

      if (failed) break;
    }

    // Update run status
    const finalStatus = failed ? 'failed' : 'success';
    const duration = Date.now() - startTime;

    await prisma.workflowRun.update({
      where: { id: runId },
      data: {
        status: finalStatus,
        completedAt: new Date(),
        duration,
      },
    });
  } catch (error) {
    await prisma.workflowRun.update({
      where: { id: runId },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
        duration: Date.now() - startTime,
      },
    });
  }
}

/**
 * Execute a single node
 */
async function executeNode(
  node: Node,
  previousResults: Record<string, any>,
  allNodes: Node[],
  edges: Edge[]
): Promise<any> {
  const nodeType = node.type || 'text';

  // Find input values from connected nodes
  const inputs = getNodeInputs(node.id, allNodes, edges, previousResults);

  switch (nodeType) {
    case 'text':
      return { output: node.data.value || inputs.value || '' };

    case 'image':
      return { output: node.data.imageUrl || inputs.imageUrl || '' };

    case 'video':
      return { output: node.data.videoUrl || inputs.videoUrl || '' };

    case 'llm':
      // Execute LLM via API
      return await executeLLMNode(node, inputs);

    case 'crop':
      // Execute crop via API
      return await executeCropNode(node, inputs);

    case 'extractFrame':
      // Execute extract frame via API
      return await executeExtractFrameNode(node, inputs);

    default:
      return { output: null };
  }
}

function getNodeInputs(
  nodeId: string,
  allNodes: Node[],
  edges: Edge[],
  previousResults: Record<string, any>
): Record<string, any> {
  const inputs: Record<string, any> = {};

  // Find all edges connected to this node
  const connectedEdges = edges.filter((e) => e.target === nodeId);

  connectedEdges.forEach((edge) => {
    const sourceNode = allNodes.find((n) => n.id === edge.source);
    if (sourceNode && previousResults[edge.source]) {
      const result = previousResults[edge.source];
      const targetHandle = edge.targetHandle || 'input';
      inputs[targetHandle] = result[edge.sourceHandle || 'output'];
    }
  });

  return inputs;
}

async function executeLLMNode(node: Node, inputs: Record<string, any>): Promise<any> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/nodes/llm/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: node.data.model,
        systemPrompt: node.data.systemPrompt || inputs.system_prompt,
        userMessage: node.data.userMessage || inputs.user_message,
        images: inputs.images || [],
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { output: data.response };
  } catch (error) {
    throw error;
  }
}

async function executeCropNode(node: Node, inputs: Record<string, any>): Promise<any> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/nodes/crop/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: node.data.imageUrl || inputs.image_url,
        xPercent: node.data.xPercent || inputs.x_percent || 0,
        yPercent: node.data.yPercent || inputs.y_percent || 0,
        widthPercent: node.data.widthPercent || inputs.width_percent || 100,
        heightPercent: node.data.heightPercent || inputs.height_percent || 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`Crop API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { output: data.croppedUrl };
  } catch (error) {
    throw error;
  }
}

async function executeExtractFrameNode(node: Node, inputs: Record<string, any>): Promise<any> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/nodes/extract-frame/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoUrl: node.data.videoUrl || inputs.video_url,
        timestamp: node.data.timestamp || inputs.timestamp || '0s',
      }),
    });

    if (!response.ok) {
      throw new Error(`Extract Frame API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { output: data.frameUrl };
  } catch (error) {
    throw error;
  }
}
