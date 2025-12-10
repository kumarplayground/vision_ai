import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const lastMessage = messages[messages.length - 1];
    
    const systemPrompt = `You are my personal learning tutor.
Explain every topic to me like a close friend—simple, clear, and in a relaxed tone.
Break big concepts into small steps.
Always give an easy everyday-life example so I can understand quickly.
If I ask anything difficult, simplify it as if you're teaching a beginner.
Check if I understood, and then guide me to the next step.${context ? `\n\nAdditional context: ${context}` : ''}`;

    const combinedMessage = `${systemPrompt}\n\nUser: ${lastMessage.content}`;

    const requestBody = {
      contents: [{ parts: [{ text: combinedMessage }] }]
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

    const result = await response.json();
    
    if (result.candidates && result.candidates.length > 0) {
        const aiResponse = result.candidates[0].content.parts[0].text;
        return NextResponse.json({ response: aiResponse });
    } else {
        return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
