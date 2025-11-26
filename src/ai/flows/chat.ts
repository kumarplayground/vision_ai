'use server';

/**
 * @fileOverview AI chat assistant using ModelsLab API with gpt-oss-120b model.
 *
 * - chatWithAI - A function that handles chat conversations using ModelsLab API.
 * - ChatInput - The input type for the chatWithAI function.
 * - ChatOutput - The return type for the chatWithAI function.
 */

export interface ChatInput {
  message: string;
  context?: string;
}

export interface ChatOutput {
  response: string;
}

interface ModelsLabMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ModelsLabRequest {
  key: string;
  model_id: string;
  messages: ModelsLabMessage[];
}

interface ModelsLabResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message: string;
  };
}

export async function chatWithAI(input: ChatInput): Promise<ChatOutput> {
  const endpointUrl = 'https://modelslab.com/api/v7/llm/chat/completions';
  
  const apiKey = process.env.MODELSLAB_API_KEY;
  
  if (!apiKey) {
    throw new Error('ModelsLab API key is not configured');
  }

  // Build the messages array with system prompt
  const messages: ModelsLabMessage[] = [
    {
      role: 'system',
      content: `You are my personal learning tutor.
Explain every topic to me like a close friend—simple, clear, and in a relaxed tone.
Break big concepts into small steps.
Always give an easy everyday-life example so I can understand quickly.
If I ask anything difficult, simplify it as if you're teaching a beginner.
Check if I understood, and then guide me to the next step.${input.context ? `\n\nAdditional context: ${input.context}` : ''}`
    },
    {
      role: 'user',
      content: input.message
    }
  ];

  const requestBody: ModelsLabRequest = {
    key: apiKey,
    model_id: 'gpt-oss-120b',
    messages: messages
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
      let errorResult: ModelsLabResponse;
      try {
        errorResult = await response.json();
      } catch (e) {
        errorResult = { error: { message: await response.text() } };
      }
      throw new Error(`API Error (${response.status}): ${errorResult.error?.message || response.statusText || 'Unknown error'}`);
    }

    const result: ModelsLabResponse = await response.json();
    
    // Extract the response from the API result
    const aiResponse = result.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response content from API');
    }

    return {
      response: aiResponse
    };
  } catch (error) {
    console.error('Error making ModelsLab API request:', error);
    throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}