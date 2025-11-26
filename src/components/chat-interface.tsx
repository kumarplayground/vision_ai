'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => Promise<string>;
  placeholder?: string;
  welcomeMessage?: string;
}

export function ChatInterface({ 
  onSendMessage, 
  placeholder = "Type your message here...",
  welcomeMessage = "Hello! How can I help you today?"
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Delay scroll to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Call the onSendMessage function if provided
      const response = onSendMessage 
        ? await onSendMessage(userInput)
        : "I'm a demo chat interface. Please connect me to an AI service to provide real responses.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat Messages Area */}
      <div className={cn(
        "flex-1 overflow-hidden transition-all duration-500 ease-in-out",
        hasMessages ? "flex flex-col" : "flex items-center justify-center"
      )}>
        {!hasMessages ? (
          /* Centered Welcome State */
          <div className="text-center max-w-2xl mx-auto px-4">
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Vision AI Assistant</h1>
              <p className="text-muted-foreground text-lg">{welcomeMessage}</p>
            </div>
            
            {/* Suggested prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {[
                "Tell me about AI career opportunities",
                "What courses do you recommend?",
                "Help me write a job description",
                "Explain machine learning concepts"
              ].map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInput(prompt)}
                  className="p-3 text-left border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <span className="text-sm">{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages List */
          <div 
            className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-webkit" 
            ref={scrollAreaRef}
          >
            <div className="max-w-4xl mx-auto py-4 px-4 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarImage src="/ai-avatar.png" />
                      <AvatarFallback>
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2",
                      message.role === 'user'
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-muted"
                    )}
                  >
                    {message.role === 'user' ? (
                      <p className="m-0 whitespace-pre-wrap text-white">
                        {message.content}
                      </p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:text-blue-600 dark:prose-code:text-blue-400">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            code({ node, inline, className, children, ...props }: any) {
                              return inline ? (
                                <code className={cn("px-1 py-0.5 rounded bg-muted text-sm", className)} {...props}>
                                  {children}
                                </code>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                            pre({ children, ...props }: any) {
                              return (
                                <pre className="overflow-x-auto rounded-md bg-gray-900 p-4 my-2" {...props}>
                                  {children}
                                </pre>
                              );
                            },
                            a({ href, children, ...props }: any) {
                              return (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline" {...props}>
                                  {children}
                                </a>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarImage src="/user-avatar.png" />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarImage src="/ai-avatar.png" />
                    <AvatarFallback>
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              className="flex-1 min-h-[44px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[44px] w-[44px]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}