import { NextResponse } from 'next/server';
import { createCropImageTask, triggerTask, pollTaskResult } from '@/lib/trigger';
import { z } from 'zod';

const CropExecutionSchema = z.object({
  imageUrl: z.string().url(),
  xPercent: z.number().min(0).max(100),
  yPercent: z.number().min(0).max(100),
  widthPercent: z.number().min(0).max(100),
  heightPercent: z.number().min(0).max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, xPercent, yPercent, widthPercent, heightPercent } =
      CropExecutionSchema.parse(body);

    // Create trigger.dev task
    const task = createCropImageTask({
      imageUrl,
      x_percent: xPercent,
      y_percent: yPercent,
      width_percent: widthPercent,
      height_percent: heightPercent,
    });

    // Trigger the task
    const result = await triggerTask(task);

    if (result.status === 'pending') {
      // Poll for result
      const finalResult = await pollTaskResult(result.id, 60, 500);
      return NextResponse.json({
        croppedUrl: finalResult.result.url,
        taskId: result.id,
      });
    } else if (result.status === 'success') {
      return NextResponse.json({
        croppedUrl: result.result.url,
        taskId: result.id,
      });
    } else {
      throw new Error(result.error || 'Crop task failed');
    }
  } catch (error) {
    console.error('Error executing crop node:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to crop image' },
      { status: 500 }
    );
  }
}
