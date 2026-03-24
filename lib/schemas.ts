import { z } from 'zod';

// Workflow Schema
export const WorkflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
  description: z.string().optional(),
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
});

export type Workflow = z.infer<typeof WorkflowSchema>;

// Node Types
export const NodeTypeSchema = z.enum([
  'text',
  'image',
  'video',
  'llm',
  'crop',
  'extract-frame',
]);

export type NodeType = z.infer<typeof NodeTypeSchema>;

// Execution Status
export const StatusSchema = z.enum(['success', 'failed', 'partial', 'running']);
export type Status = z.infer<typeof StatusSchema>;

export const ScopeSchema = z.enum(['full', 'single', 'partial']);
export type Scope = z.infer<typeof ScopeSchema>;

// Trigger.dev integration
export const TriggerTaskSchema = z.object({
  id: z.string(),
  type: z.string(),
  payload: z.record(z.any()),
});

export type TriggerTask = z.infer<typeof TriggerTaskSchema>;
