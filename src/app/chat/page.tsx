import { ChatInterface } from '@/components/chat-interface';
import { chatWithAI } from '@/ai/flows/chat';
import { Header } from '@/components/header';

async function handleSendMessage(message: string): Promise<string> {
  'use server';
  
  try {
    const result = await chatWithAI({ message });
    return result.response;
  } catch (error) {
    console.error('Error in chat:', error);
    return "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
  }
}

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-hidden">
        <ChatInterface 
          onSendMessage={handleSendMessage}
          placeholder="Ask me anything about AI, careers, or courses..."
          welcomeMessage="I'm here to help you with AI learning, career guidance, and course recommendations!"
        />
      </div>
    </div>
  );
}