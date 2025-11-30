import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();
    const apiKey = process.env.MODELSLAB_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const endpointUrl = 'https://modelslab.com/api/v7/llm/chat/completions';

    // Extract the last user message to use as the prompt if needed, 
    // but usually we send the whole history or just the new message.
    // The previous implementation sent: System Prompt + User Message.
    // Let's try to respect that structure or improve it by sending history.
    // For now, let's stick to the previous logic: System + User (last message).
    
    const lastMessage = messages[messages.length - 1];
    
    const apiMessages = [
      {
        role: 'system',
        content: `You are my personal learning tutor.
Explain every topic to me like a close friend—simple, clear, and in a relaxed tone.
Break big concepts into small steps.
Always give an easy everyday-life example so I can understand quickly.
If I ask anything difficult, simplify it as if you're teaching a beginner.
Check if I understood, and then guide me to the next step.${context ? `\n\nAdditional context: ${context}` : ''}`
      },
      {
        role: 'user',
        content: lastMessage.content
      }
    ];

    const requestBody = {
      key: apiKey,
      model_id: 'gpt-oss-120b',
      messages: apiMessages,
      stream: true
    };

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return NextResponse.json({ error: `API Error: ${response.status}` }, { status: response.status });
    }

    // Create a stream to pass back to the client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // Pass the raw chunk to the client
            controller.enqueue(value);
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
