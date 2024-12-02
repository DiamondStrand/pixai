'use client'

import { useState, useEffect, useRef } from 'react'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import ReactMarkdown from 'react-markdown'

// Ta bort openai import då vi inte längre behöver den på klienten
// Resten av interfacen är oförändrade...

interface UserData {
  firstname?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  termsAccepted?: boolean;
  message: string;
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
  id?: number; // Lägg till optional id
}

export default function Register() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `Hej!\nJag heter Maia och jag kommer hjälpa dig med registreringen. Kan du börja med att ange ditt förnamn & efternamn?

*OBS: Det är mycket viktigt att alla uppgifter du anger är korrekta. Enligt våra användarvillkor är det endast tillåtet att ha ett konto per person. Att skapa flera konton eller ange felaktiga uppgifter strider mot våra villkor och kan leda till avstängning.*`,
      id: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [userData, setUserData] = useState<UserData>({ message: '' })
  const [displayName, setDisplayName] = useState('Laddar namn...')
  const [currentStep, setCurrentStep] = useState('name')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    inputRef.current?.focus()
  }, [messages])

  // Add new useEffect for loading state
  useEffect(() => {
    inputRef.current?.focus()
  }, [isLoading])

  const processAIResponse = async (userMessage: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage, id: Date.now() }]
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const messageId = Date.now();
      let accumulatedContent = '';
  
      setMessages((prev: Message[]) => {
        const newMessages: Message[] = [...prev, { 
          role: 'assistant', 
          content: 'Väntar på svar...',  // Add default content
          id: messageId 
        }];
        return newMessages;
      });
  
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
  
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
  
          const text = new TextDecoder().decode(value);
          if (text) {
            try {
              const jsonData = JSON.parse(text);
              if (jsonData.message && jsonData.message.trim()) {  // Add trim check
                setMessages(prev => {
                  const newMessages = prev.map(msg => 
                    msg.id === messageId 
                      ? { ...msg, content: jsonData.message }
                      : msg
                  );
                  return newMessages;
                });
                
                // Update displayName if firstname is present in the response
                if (jsonData.firstname) {
                  setDisplayName(jsonData.firstname);
                }
              }
            } catch {
              // Not valid JSON, accumulate the content
              accumulatedContent += text;
              
              // Try to find complete JSON objects in accumulated content
              const matches = accumulatedContent.match(/{[^}]*}/g);
              if (matches) {
                const lastMatch = matches[matches.length - 1];
                try {
                  const jsonData = JSON.parse(lastMatch);
                  if (jsonData.message) {
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === messageId 
                          ? { ...msg, content: jsonData.message }
                          : msg
                      )
                    );
                  }
                  // Remove the processed JSON from accumulated content
                  accumulatedContent = accumulatedContent.slice(lastMatch.length);
                } catch {
                  // Invalid JSON, continue accumulating
                }
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
        // Add final check for empty message
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId && (!msg.content || !msg.content.trim())
              ? { ...msg, content: 'Ett fel uppstod. Vänligen försök igen.' }
              : msg
          )
        );
      }
  
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Ett fel uppstod. Vänligen försök igen.',
        id: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message with id
    const userMessage = { 
      role: 'user' as const, 
      content: input,
      id: Date.now() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Get AI response - ta bort extra message update eftersom det hanteras i processAIResponse
    await processAIResponse(input);
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-[#343541] text-gray-900 dark:text-gray-50">
      <div className="flex flex-col flex-grow h-full max-w-4xl mx-auto w-full px-4 py-16">
        <ScrollArea className="flex flex-col flex-grow py-8 px-4">
          <div className="flex flex-col">
            {messages.map((message, index) => (
              <div key={message.id || index} className="flex flex-col mb-4">
                <span className={`text-sm mb-2 ${
                  message.role === 'assistant'
                    ? 'text-gray-600 dark:text-gray-300'
                    : 'text-gray-800 dark:text-gray-400 self-end'
                }`}>
                  {message.role === 'assistant' ? 'Maia' : displayName}
                </span>
                <div
                  className={`flex rounded ${
                    message.role === 'assistant'
                      ? 'dark:bg-[#444650] bg-gray-100 dark:text-white text-gray-800 p-4'
                      : 'dark:bg-[#444654] bg-gray-200 dark:text-white text-gray-950 ml-auto p-4'
                  }`}
                >
                  <div className="leading-relaxed">
                    {message.role === 'assistant' ? (
                      <ReactMarkdown
                        className="prose dark:prose-invert max-w-none"
                        components={{
                          a: ({node, ...props}) => (
                            <a 
                              className="inline-block px-4 py-2 mr-2 my-4 rounded-md bg-[#10a37f] hover:bg-[#0e916f] text-white text-xs no-underline transition-colors duration-200" 
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props} 
                            />
                          ),
                          p: ({node, children, ...props}) => {
                            // Check if the paragraph contains a summary item (starts with "**")
                            const isSummaryItem = typeof children === 'string' && children.startsWith('**');
                            return (
                              <p 
                                className={`mb-2 ${isSummaryItem ? 'block w-full' : ''}`} 
                                {...props}
                              >
                                {children}
                              </p>
                            );
                          },
                          ul: ({node, ...props}) => <ul className="mb-2 flex flex-wrap gap-2 list-none pl-0" {...props} />,
                          li: ({node, ...props}) => <li className="m-0" {...props} />,
                          blockquote: ({node, ...props}) => (
                            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic" {...props} />
                          ),
                          strong: ({node, ...props}) => (
                            <strong className="font-bold text-emerald-600 dark:text-emerald-400" {...props} />
                          ),
                          em: ({node, ...props}) => (
                            <em 
                              className="text-[11px] text-gray-500 dark:text-gray-400 block mt-4 mb-2 leading-normal opacity-80  rounded-md" 
                              {...props} 
                            />
                          ),
                        }}
                      >
                        {message.content?.trim() || 'Väntar på svar...'}
                      </ReactMarkdown>
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content?.trim() || ''}</div>
                    )}
                    {isLoading && message.role === 'assistant' && index === messages.length - 1 && (
                      <span className="typing-animation">...</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <ScrollBar orientation='vertical'/>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-transparent mt-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={() => inputRef.current?.focus()} // Add this line
            placeholder="Skriv ditt meddelande här..."
            disabled={isLoading}
            className="flex-1 p-3 rounded border border-[#565869] bg-gray-200 dark:bg-[#40414f] dark:text-white text-gray-950 text-base focus:outline-none focus:border-[#10a37f]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-3 px-6 bg-[#10a37f] text-white rounded cursor-pointer text-base hover:bg-[#0e916f] disabled:opacity-50"
          >
            {isLoading ? 'Skickar...' : 'Skicka'}
          </button>
        </form>
      </div>
    </div>
  )
}
