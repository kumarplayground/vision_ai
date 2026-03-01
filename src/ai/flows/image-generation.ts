'use server';

import { generateImageWithFreepik } from '@/ai/flows/freepik-image-generation';

interface ImageGenerationInput {
  prompt: string;
}

interface ImageGenerationOutput {
  imageUrl: string;
  status: string;
}

async function generateImageWithModelsLab(input: ImageGenerationInput): Promise<ImageGenerationOutput> {
  const endpointUrl = 'https://modelslab.com/api/v7/images/text-to-image';
  const apiKey = process.env.MODELSLAB_API_KEY;

  if (!apiKey) {
    throw new Error('ModelsLab API key is not configured (MODELSLAB_API_KEY)');
  }

  const requestBody = {
    prompt: input.prompt,
    model_id: 'nano-banana-pro',
    aspect_ratio: '1:1',
    key: apiKey,
  };

  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorResult: any;
    try {
      errorResult = await response.json();
    } catch {
      errorResult = { error: { message: await response.text() } };
    }
    throw new Error(
      `API Error (${response.status}): ${errorResult.error?.message || response.statusText || 'Unknown error'}`
    );
  }

  const result = await response.json();

  if (result?.output && Array.isArray(result.output) && result.output.length > 0) {
    return {
      imageUrl: result.output[0],
      status: 'success',
    };
  }

  throw new Error('No image URL in response');
}

export async function generateImage(input: ImageGenerationInput): Promise<ImageGenerationOutput> {
  try {
    // Default provider: Freepik
    if (process.env.FREEPIK_API_KEY) {
      const freepik = await generateImageWithFreepik({ prompt: input.prompt });
      return { imageUrl: freepik.imageUrl, status: freepik.status };
    }

    // Fallback provider: ModelsLab (only if explicitly configured)
    if (process.env.MODELSLAB_API_KEY) {
      return await generateImageWithModelsLab(input);
    }

    throw new Error('No image generation API key configured (set FREEPIK_API_KEY or MODELSLAB_API_KEY)');

  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
