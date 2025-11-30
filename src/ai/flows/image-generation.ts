'use server';

interface ImageGenerationInput {
  prompt: string;
}

interface ImageGenerationOutput {
  imageUrl: string;
  status: string;
}

export async function generateImage(input: ImageGenerationInput): Promise<ImageGenerationOutput> {
  const endpointUrl = 'https://modelslab.com/api/v7/images/text-to-image';
  
  // Use the key provided by the user or from env
  const apiKey = process.env.MODELSLAB_API_KEY || 'COsrqkYCDBMx1Iwk6bEjlWGEyX9EkKG4HmbCuKyLwZlurrbczK3upUimGPhn';
  
  const requestBody = {
    "prompt": input.prompt,
    "model_id": "nano-banana-pro",
    "aspect_ratio": "1:1",
    "key": apiKey
  };

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      let errorResult;
      try {
        errorResult = await response.json();
      } catch (e) {
        errorResult = { error: { message: await response.text() } };
      }
      throw new Error(`API Error (${response.status}): ${errorResult.error?.message || response.statusText || 'Unknown error'}`);
    }

    const result = await response.json();
    
    // The API response structure usually contains the image URL in 'output' array
    // Based on typical ModelsLab/Stable Diffusion API responses
    if (result.status === 'success' && result.output && result.output.length > 0) {
        return {
            imageUrl: result.output[0],
            status: 'success'
        };
    } else if (result.output && result.output.length > 0) {
         // Sometimes status might be different but output is there
         return {
            imageUrl: result.output[0],
            status: 'success'
        };
    }
    
    throw new Error('No image URL in response');

  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
