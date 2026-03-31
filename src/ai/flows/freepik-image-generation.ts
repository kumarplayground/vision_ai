'use server';

interface FreepikImageGenerationInput {
  prompt: string;
  width?: number;
  height?: number;
  aspectRatio?:
    | 'square_1_1'
    | 'classic_4_3'
    | 'traditional_3_4'
    | 'widescreen_16_9'
    | 'social_story_9_16'
    | 'standard_3_2'
    | 'portrait_2_3'
    | 'horizontal_2_1'
    | 'vertical_1_2'
    | 'social_post_4_5';
  seed?: number;
  promptUpsampling?: boolean;
}

interface FreepikCreateTaskResponse {
  data?: {
    task_id?: string;
    status?: 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  };
  message?: string;
}

interface FreepikTaskStatusResponse {
  data?: {
    task_id?: string;
    status?: 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    generated?: string[];
  };
  message?: string;
}

export interface FreepikImageGenerationOutput {
  imageUrl: string;
  status: 'success';
  taskId?: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function getDefaultSizeForAspectRatio(
  aspectRatio: FreepikImageGenerationInput['aspectRatio']
): { width: number; height: number } {
  switch (aspectRatio) {
    case 'classic_4_3':
      return { width: 1024, height: 768 };
    case 'traditional_3_4':
      return { width: 768, height: 1024 };
    case 'widescreen_16_9':
      return { width: 1440, height: 768 };
    case 'social_story_9_16':
      return { width: 768, height: 1440 };
    case 'standard_3_2':
      return { width: 1440, height: 960 };
    case 'portrait_2_3':
      return { width: 768, height: 1152 };
    case 'horizontal_2_1':
      return { width: 1440, height: 720 };
    case 'vertical_1_2':
      return { width: 720, height: 1440 };
    case 'social_post_4_5':
      return { width: 1024, height: 1280 };
    case 'square_1_1':
    default:
      return { width: 1024, height: 1024 };
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const json = await response.json();
    if (typeof json?.message === 'string') return json.message;
    if (typeof json?.error?.message === 'string') return json.error.message;
    return JSON.stringify(json);
  } catch {
    try {
      return await response.text();
    } catch {
      return response.statusText || 'Unknown error';
    }
  }
}

/**
 * Generates an image using Freepik's Text-to-Image API (Flux 2 Pro).
 *
 * Docs:
 * - Create: https://docs.freepik.com/api-reference/text-to-image/post-flux-2-pro
 * - Status: https://docs.freepik.com/api-reference/text-to-image/get-flux-2-pro-task
 * Auth header: x-freepik-api-key
 */
export async function generateImageWithFreepik(
  input: FreepikImageGenerationInput
): Promise<FreepikImageGenerationOutput> {
  const apiKey = process.env.FREEPIK_API_KEY;
  if (!apiKey) {
    throw new Error('Freepik API key is not configured (FREEPIK_API_KEY)');
  }

  const createTaskUrl = 'https://api.freepik.com/v1/ai/text-to-image/flux-2-pro';

  const defaultSize = getDefaultSizeForAspectRatio(input.aspectRatio);
  const width = clampInt(input.width ?? defaultSize.width, 256, 1440);
  const height = clampInt(input.height ?? defaultSize.height, 256, 1440);

  const createBody = {
    prompt: input.prompt,
    width,
    height,
    seed: input.seed,
    prompt_upsampling: input.promptUpsampling ?? false,
  };

  const createResponse = await fetch(createTaskUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-freepik-api-key': apiKey,
    },
    body: JSON.stringify(createBody),
    cache: 'no-store',
  });

  if (!createResponse.ok) {
    const msg = await readErrorMessage(createResponse);
    throw new Error(`Freepik API error (${createResponse.status}): ${msg}`);
  }

  const createResult = (await createResponse.json()) as FreepikCreateTaskResponse;
  const taskId = createResult.data?.task_id;
  if (!taskId) {
    throw new Error('Freepik API did not return a task_id');
  }

  // Some tasks may already include a generated URL in the create response.
  const createGenerated = (createResult as any)?.data?.generated;
  if (Array.isArray(createGenerated) && createGenerated.length > 0 && typeof createGenerated[0] === 'string') {
    return { imageUrl: createGenerated[0], status: 'success', taskId };
  }

  const statusUrl = `https://api.freepik.com/v1/ai/text-to-image/flux-2-pro/${taskId}`;
  const startedAt = Date.now();
  const timeoutMs = 120_000;
  const pollIntervalMs = 1_500;

  // Small initial delay so we don't immediately hammer the status endpoint.
  await sleep(750);

  while (Date.now() - startedAt < timeoutMs) {
    const statusResponse = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'x-freepik-api-key': apiKey,
      },
      cache: 'no-store',
    });

    if (!statusResponse.ok) {
      const msg = await readErrorMessage(statusResponse);
      throw new Error(`Freepik API error (${statusResponse.status}): ${msg}`);
    }

    const statusResult = (await statusResponse.json()) as FreepikTaskStatusResponse;
    const status = statusResult.data?.status;

    if (status === 'COMPLETED') {
      const generated = statusResult.data?.generated;
      const imageUrl = Array.isArray(generated) && generated.length > 0 ? generated[0] : undefined;
      if (!imageUrl) {
        throw new Error('Freepik task completed, but no generated image URL was returned');
      }
      return { imageUrl, status: 'success', taskId };
    }

    if (status === 'FAILED') {
      throw new Error('Freepik image generation task failed');
    }

    await sleep(pollIntervalMs);
  }

  throw new Error('Freepik image generation timed out while waiting for completion');
}
