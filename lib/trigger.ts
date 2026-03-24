// Trigger.dev task execution utilities
import axios from 'axios';

const TRIGGER_BASE_URL = process.env.TRIGGER_API_URL || 'https://api.trigger.dev/v1';
const TRIGGER_API_KEY = process.env.TRIGGER_API_KEY;

interface TriggerTask {
  id: string;
  type: string;
  payload: Record<string, any>;
}

interface TriggerTaskResult {
  id: string;
  status: 'success' | 'failed' | 'pending';
  result?: any;
  error?: string;
}

export async function triggerTask(task: TriggerTask): Promise<TriggerTaskResult> {
  try {
    const response = await axios.post(`${TRIGGER_BASE_URL}/tasks`, task, {
      headers: {
        Authorization: `Bearer ${TRIGGER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error triggering task:', error);
    throw error;
  }
}

export async function getTaskStatus(taskId: string): Promise<TriggerTaskResult> {
  try {
    const response = await axios.get(`${TRIGGER_BASE_URL}/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${TRIGGER_API_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting task status:', error);
    throw error;
  }
}

export function createLLMTask(payload: {
  model: string;
  systemPrompt?: string;
  userMessage: string;
  images?: string[];
}): TriggerTask {
  return {
    id: `llm-${Date.now()}`,
    type: 'llm-gemini',
    payload,
  };
}

export function createCropImageTask(payload: {
  imageUrl: string;
  x_percent: number;
  y_percent: number;
  width_percent: number;
  height_percent: number;
}): TriggerTask {
  return {
    id: `crop-${Date.now()}`,
    type: 'crop-image-ffmpeg',
    payload,
  };
}

export function createExtractFrameTask(payload: {
  videoUrl: string;
  timestamp: string;
}): TriggerTask {
  return {
    id: `extract-${Date.now()}`,
    type: 'extract-frame-ffmpeg',
    payload,
  };
}

// Poll task result
export async function pollTaskResult(
  taskId: string,
  maxAttempts: number = 60,
  interval: number = 1000
): Promise<TriggerTaskResult> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const result = await getTaskStatus(taskId);

      if (result.status === 'success' || result.status === 'failed') {
        return result;
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, interval));
    } catch (error) {
      console.error('Error polling task:', error);
      throw error;
    }
  }

  throw new Error(`Task ${taskId} timed out after ${maxAttempts * interval}ms`);
}
