'use server';

/**
 * @fileOverview AI chat assistant using Gemini API.
 *
 * - chatWithAI - A function that handles chat conversations using Gemini API.
 * - ChatInput - The input type for the chatWithAI function.
 * - ChatOutput - The return type for the chatWithAI function.
 */

export interface ChatInput {
  message: string;
  context?: string;
  attachment?: {
    base64: string;
    mimeType: string;
  };
}

export interface ChatOutput {
  response: string;
}

interface GeminiPart {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

interface GeminiContent {
  parts: GeminiPart[];
  role?: string;
}

interface GeminiCandidate {
  content: GeminiContent;
  finishReason?: string;
  index?: number;
  safetyRatings?: any[];
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: any;
  error?: {
    message: string;
  };
}

export async function chatWithAI(input: ChatInput): Promise<ChatOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  const systemPrompt = `You are my personal learning tutor.
Explain every topic to me like a close friend—simple, clear, and in a relaxed tone.
Break big concepts into small steps.
Always give an easy everyday-life example so I can understand quickly.
If I ask anything difficult, simplify it as if you're teaching a beginner.
Check if I understood, and then guide me to the next step.${input.context ? `\n\nAdditional context: ${input.context}` : ''}`;

  // Construct the request body for Gemini
  // We'll combine system prompt and user message for simplicity as per the example structure,
  // or we can use the system_instruction if we want to be more advanced, but let's stick to the user's simple example style
  // where we just send content.
  // However, to maintain the behavior of the previous system prompt, I will prepend it to the user message.
  
  const combinedMessage = `${systemPrompt}\n\nUser: ${input.message}`;

  const parts: GeminiPart[] = [{ text: combinedMessage }];

  if (input.attachment) {
    parts.push({
      inline_data: {
        mime_type: input.attachment.mimeType,
        data: input.attachment.base64
      }
    });
  }

  const requestBody = {
    contents: [{ parts }]
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
      let errorResult: any;
      try {
        errorResult = await response.json();
      } catch (e) {
        errorResult = { error: { message: await response.text() } };
      }
      throw new Error(`API Error (${response.status}): ${errorResult.error?.message || response.statusText || 'Unknown error'}`);
    }

    const result: GeminiResponse = await response.json();
    
    if (result.candidates && result.candidates.length > 0) {
        const aiResponse = result.candidates[0].content.parts[0].text;
        return {
            response: aiResponse
        };
    } else {
        throw new Error('No candidates returned from Gemini API');
    }

  } catch (error) {
    console.error('Error making Gemini API request:', error);
    throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
