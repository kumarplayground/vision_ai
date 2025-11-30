'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, History, Plus, Trash2, Menu, X, Brain, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface UserMemory {
  name?: string;
  preferences?: {
    learningStyle?: string;
    topics?: string[];
    level?: string;
  };
  conversationContext?: {
    lastTopic?: string;
    goals?: string[];
    achievements?: string[];
  };
  personalInfo?: {
    profession?: string;
    interests?: string[];
    background?: string;
  };
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => Promise<string>;
  onGenerateImage?: (prompt: string) => Promise<string>;
  placeholder?: string;
  welcomeMessage?: string;
}

export function ChatInterface({ 
  onSendMessage, 
  onGenerateImage,
  placeholder = "Type your message here...",
  welcomeMessage = "Hello! How can I help you today?"
}: ChatInterfaceProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [userMemory, setUserMemory] = useState<UserMemory>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        // Convert date strings back to Date objects
        const sessionsWithDates = parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setSessions(sessionsWithDates);
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    }

    // Load user memory
    const savedMemory = localStorage.getItem('userMemory');
    if (savedMemory) {
      try {
        setUserMemory(JSON.parse(savedMemory));
      } catch (error) {
        console.error('Error loading user memory:', error);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Save user memory to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(userMemory).length > 0) {
      localStorage.setItem('userMemory', JSON.stringify(userMemory));
    }
  }, [userMemory]);

  // Load current session messages
  useEffect(() => {
    if (currentSessionId) {
      const session = sessions.find(s => s.id === currentSessionId);
      if (session) {
        setMessages(session.messages);
      }
    } else {
      setMessages([]);
    }
  }, [currentSessionId, sessions]);

  // Generate title from first user message
  const generateTitle = (message: string): string => {
    return message.length > 30 ? message.substring(0, 30) + '...' : message;
  };

  // Create new chat session
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
  };

  // Delete a chat session
  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setMessages([]);
    }
  };

  // Update current session with new messages
  const updateSessionMessages = (sessionId: string, newMessages: Message[]) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        // Update title if this is the first user message
        const title = session.title === 'New Chat' && newMessages.length > 0
          ? generateTitle(newMessages[0].content)
          : session.title;
        
        return {
          ...session,
          title,
          messages: newMessages,
          updatedAt: new Date()
        };
      }
      return session;
    }));
  };

  // Extract and update user memory from conversation
  const updateMemoryFromMessage = (userMessage: string, aiResponse: string) => {
    const lowerMessage = userMessage.toLowerCase();
    const lowerResponse = aiResponse.toLowerCase();
    
    const updates: Partial<UserMemory> = {};

    // Extract name
    if (lowerMessage.includes('my name is') || lowerMessage.includes('i am') || lowerMessage.includes("i'm")) {
      const nameMatch = userMessage.match(/(?:my name is|i am|i'm)\s+([A-Z][a-z]+)/i);
      if (nameMatch) {
        updates.name = nameMatch[1];
      }
    }

    // Extract profession
    if (lowerMessage.includes('i work as') || lowerMessage.includes('i am a') || lowerMessage.includes('my job')) {
      updates.personalInfo = {
        ...userMemory.personalInfo,
        profession: userMessage
      };
    }

    // Extract interests
    if (lowerMessage.includes('interested in') || lowerMessage.includes('like to learn')) {
      const interests = userMemory.personalInfo?.interests || [];
      updates.personalInfo = {
        ...userMemory.personalInfo,
        interests: [...interests, userMessage]
      };
    }

    // Extract learning level
    if (lowerMessage.includes('beginner') || lowerMessage.includes('intermediate') || lowerMessage.includes('advanced')) {
      updates.preferences = {
        ...userMemory.preferences,
        level: lowerMessage.includes('beginner') ? 'beginner' : 
               lowerMessage.includes('intermediate') ? 'intermediate' : 'advanced'
      };
    }

    // Update last topic
    if (userMessage.length > 10) {
      updates.conversationContext = {
        ...userMemory.conversationContext,
        lastTopic: generateTitle(userMessage)
      };
    }

    if (Object.keys(updates).length > 0) {
      setUserMemory(prev => ({ ...prev, ...updates }));
    }
  };

  // Build context string from memory for AI
  const buildMemoryContext = (): string => {
    const contextParts: string[] = [];
    
    if (userMemory.name) {
      contextParts.push(`User's name: ${userMemory.name}`);
    }
    
    if (userMemory.preferences?.level) {
      contextParts.push(`Learning level: ${userMemory.preferences.level}`);
    }
    
    if (userMemory.personalInfo?.profession) {
      contextParts.push(`Profession: ${userMemory.personalInfo.profession}`);
    }
    
    if (userMemory.conversationContext?.lastTopic) {
      contextParts.push(`Previous topic: ${userMemory.conversationContext.lastTopic}`);
    }
    
    if (userMemory.personalInfo?.interests && userMemory.personalInfo.interests.length > 0) {
      contextParts.push(`Interests: ${userMemory.personalInfo.interests.slice(-3).join(', ')}`);
    }

    // Add recent messages from current session for context
    if (messages.length > 0) {
      const recentMessages = messages.slice(-4).map(m => 
        `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content.substring(0, 100)}`
      ).join('\n');
      contextParts.push(`Recent conversation:\n${recentMessages}`);
    }
    
    return contextParts.length > 0 ? contextParts.join('\n') : '';
  };

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

    // Create new session if none exists
    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    const userInput = input.trim();
    setInput('');
    setIsLoading(true);
    
    // Store current mode to use in request
    const wasImageMode = isImageMode;
    // Reset image mode after sending
    if (wasImageMode) setIsImageMode(false);

    // Determine active session ID
    let activeSessionId = currentSessionId;
    if (!activeSessionId) {
      activeSessionId = Date.now().toString();
      setCurrentSessionId(activeSessionId);
      
      // Create new session immediately
      const newSession: ChatSession = {
        id: activeSessionId,
        title: 'New Chat',
        messages: updatedMessages,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setSessions(prev => [newSession, ...prev]);
    } else {
      // Update existing session
      updateSessionMessages(activeSessionId, updatedMessages);
    }

    try {
      let response: string;

      if (wasImageMode && onGenerateImage) {
        const imageUrl = await onGenerateImage(userInput);
        response = `![Generated Image](${imageUrl})`;
      } else {
        // Call the onSendMessage function if provided
        const memoryContext = buildMemoryContext();
        response = onSendMessage 
          ? await onSendMessage(userInput + (memoryContext ? `\n\n[Context: ${memoryContext}]` : ''))
          : "I'm a demo chat interface. Please connect me to an AI service to provide real responses.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      
      // Update session with final messages
      if (activeSessionId) {
        updateSessionMessages(activeSessionId, finalMessages);
      }
      
      // Update memory from this conversation
      updateMemoryFromMessage(userInput, response);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      
      if (activeSessionId) {
        updateSessionMessages(activeSessionId, finalMessages);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar - Recent Chats */}
      <div className={cn(
        "flex-shrink-0 bg-card border-r transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-0"
      )}>
        {isSidebarOpen && (
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">VI</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={createNewSession}
                title="New Chat"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-2">
              {sessions.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground p-4">
                  No chat history yet
                </div>
              ) : (
                <div className="space-y-1">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        "group relative p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors",
                        currentSessionId === session.id && "bg-accent"
                      )}
                      onClick={() => setCurrentSessionId(session.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {session.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.messages.length} messages
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(session.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Section */}
            <div className="flex-shrink-0 border-t p-3 bg-card">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/user-avatar.png" alt={userMemory.name || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    {userMemory.name ? userMemory.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {userMemory.name || 'User'}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Free Plan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toggle Sidebar Button */}
        <div className="flex-shrink-0 p-2 border-b bg-background flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

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
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant={isImageMode ? "default" : "outline"}
                  size="icon"
                  className={cn("h-[44px] w-[44px] flex-shrink-0", isImageMode && "bg-purple-600 hover:bg-purple-700")}
                >
                  <Plus className={cn("w-4 h-4 transition-transform", isImageMode && "rotate-45")} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setIsImageMode(!isImageMode)}>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {isImageMode ? 'Switch to Chat' : 'Generate Image'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isImageMode ? "Describe the image you want to generate..." : placeholder}
              disabled={isLoading}
              className={cn(
                "flex-1 min-h-[44px] resize-none",
                isImageMode && "border-purple-600 focus-visible:ring-purple-600"
              )}
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
              className={cn(
                "h-[44px] w-[44px]",
                isImageMode && "bg-purple-600 hover:bg-purple-700"
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {isImageMode ? 'Enter a detailed prompt to generate an image' : 'Press Enter to send, Shift + Enter for new line'}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}