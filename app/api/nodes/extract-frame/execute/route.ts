import { NextResponse } from 'next/server';
import { createExtractFrameTask, triggerTask, pollTaskResult } from '@/lib/trigger';
import { z } from 'zod';

const ExtractFrameSchema = z.object({
  videoUrl: z.string().url(),
  timestamp: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoUrl, timestamp } = ExtractFrameSchema.parse(body);

    // Create trigger.dev task
    const task = createExtractFrameTask({
      videoUrl,
      timestamp,
    });

    // Trigger the task
    const result = await triggerTask(task);

    if (result.status === 'pending') {
      // Poll for result
      const finalResult = await pollTaskResult(result.id, 60, 500);
      return NextResponse.json({
        frameUrl: finalResult.result.url,
        taskId: result.id,
      });
    } else if (result.status === 'success') {
      return NextResponse.json({
        frameUrl: result.result.url,
        taskId: result.id,
      });
    } else {
      throw new Error(result.error || 'Extract frame task failed');
    }
  } catch (error) {
    console.error('Error executing extract frame node:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract frame' },
      { status: 500 }
    );
  }
}
