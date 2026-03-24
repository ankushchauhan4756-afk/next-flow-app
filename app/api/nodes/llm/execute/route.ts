import { NextResponse } from 'next/server';
import { generateResponse, SUPPORTED_MODELS } from '@/lib/gemini';
import { z } from 'zod';

const LLMExecutionSchema = z.object({
  model: z.string().refine((m) => SUPPORTED_MODELS.includes(m), 'Unsupported model'),
  systemPrompt: z.string().optional(),
  userMessage: z.string(),
  images: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { model, systemPrompt, userMessage, images } = LLMExecutionSchema.parse(body);

    const response = await generateResponse({
      model,
      systemPrompt,
      userMessage,
      images,
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error executing LLM node:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to execute LLM' },
      { status: 500 }
    );
  }
}
