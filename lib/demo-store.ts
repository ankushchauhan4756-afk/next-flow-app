// In-memory storage for demo mode workflows
export const demoWorkflows = new Map<string, any>();

export function createWorkflow(data: any) {
  const workflow = {
    id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'demo-user-123',
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  demoWorkflows.set(workflow.id, workflow);
  return workflow;
}

export function getWorkflow(id: string, userId: string) {
  const workflow = demoWorkflows.get(id);
  if (workflow && workflow.userId === userId) {
    return workflow;
  }
  return null;
}

export function getWorkflows(userId: string) {
  const workflows: any[] = [];
  demoWorkflows.forEach((workflow) => {
    if (workflow.userId === userId) {
      workflows.push(workflow);
    }
  });
  return workflows;
}

export function updateWorkflow(id: string, userId: string, data: any) {
  const workflow = demoWorkflows.get(id);
  if (!workflow || workflow.userId !== userId) {
    return null;
  }
  const updated = {
    ...workflow,
    ...data,
    updatedAt: new Date(),
  };
  demoWorkflows.set(id, updated);
  return updated;
}

export function deleteWorkflow(id: string, userId: string) {
  const workflow = demoWorkflows.get(id);
  if (!workflow || workflow.userId !== userId) {
    return false;
  }
  demoWorkflows.delete(id);
  return true;
}
