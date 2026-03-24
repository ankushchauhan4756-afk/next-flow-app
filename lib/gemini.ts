// Google Gemini API integration
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

if (!API_KEY) {
  console.warn('NEXT_PUBLIC_GOOGLE_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

export const SUPPORTED_MODELS = [
  'gemini-pro',
  'gemini-pro-vision',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
];

export async function generateResponse(payload: {
  model: string;
  systemPrompt?: string;
  userMessage: string;
  images?: string[];
}): Promise<string> {
  try {
    const { model, systemPrompt, userMessage, images } = payload;

    if (!SUPPORTED_MODELS.includes(model)) {
      throw new Error(`Model ${model} is not supported`);
    }

    const client = genAI.getGenerativeModel({ model });

    // Build the prompt with system context if provided
    let fullPrompt = userMessage;
    if (systemPrompt) {
      fullPrompt = `${systemPrompt}\n\n${userMessage}`;
    }

    // Handle multimodal input with images
    if (images && images.length > 0) {
      const parts: any[] = [];

      // Add text part
      parts.push({ text: fullPrompt });

      // Add image parts
      for (const imageUrl of images) {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const base64 = await blobToBase64(blob);
          const mimeType = blob.type || 'image/jpeg';

          parts.push({
            inlineData: {
              mimeType,
              data: base64,
            },
          });
        } catch (error) {
          console.error(`Error processing image ${imageUrl}:`, error);
        }
      }

      const result = await client.generateContent(parts);

      return result.response.text();
    } else {
      // Text-only input
      const result = await client.generateContent(fullPrompt);
      return result.response.text();
    }
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]); // Remove data:image/xxx;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Validate image URL
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/') || false;
  } catch {
    return false;
  }
}

// Get base64 from URL
export async function getBase64FromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return blobToBase64(blob);
  } catch (error) {
    console.error('Error converting URL to base64:', error);
    throw error;
  }
}
