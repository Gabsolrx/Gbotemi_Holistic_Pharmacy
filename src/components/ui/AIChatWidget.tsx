import { useState, useRef, useEffect, FormEvent } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am the Gbotemi Pharmacy AI Assistant. How can I help you today with your health or medication questions?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send chat history (excluding the first welcome message to save tokens if desired, but we'll include it)
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: history.slice(1) // exclude the hardcoded welcome message from history
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response
        }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting to the server right now. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI Assistant Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg shadow-emerald-950/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 z-40 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 bg-transparent p-0 border-0 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        aria-label="Open Pharmacy AI Health Assistant"
      >
        {/* Exact Pharmacy AI Green & White Icon - Undistorted */}
        <img
          src="https://i.ibb.co/4gPZw7Tf/pharmacy-ai-green-white.png"
          alt="pharmacy ai green white"
          className="w-full h-full object-contain rounded-full select-none relative z-10 drop-shadow-xs"
          onError={(e) => {
            e.currentTarget.src = '/pharmacy-ai-green-white.png';
          }}
        />

        {/* Pulse waves identical to WhatsApp FAB */}
        <span 
          className="absolute inset-0 rounded-full bg-emerald-500 opacity-35 animate-ping pointer-events-none" 
          style={{ animationDuration: '2s' }} 
        />
        <span className="absolute -inset-1 rounded-full border-2 border-emerald-500/40 animate-pulse pointer-events-none" />

        {/* Accessible Hover Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3.5 py-2 bg-gray-900/95 text-white text-xs sm:text-sm font-medium rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg flex items-center gap-2 z-20">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Ask AI Health Assistant</span>
        </div>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-800 to-primary-700 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden shadow-xs flex-shrink-0 bg-white/10">
              <img
                src="https://i.ibb.co/4gPZw7Tf/pharmacy-ai-green-white.png"
                alt="pharmacy ai green white"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  e.currentTarget.src = '/pharmacy-ai-green-white.png';
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <span>Gbotemi Assistant</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-100 px-1.5 py-0.5 rounded font-semibold">AI</span>
              </h3>
              <p className="text-xs text-primary-100">Intelligent Healthcare Guidance</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-primary-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                  msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-transparent'
                }`}>
                  {msg.role === 'user' ? (
                    <User size={16} />
                  ) : (
                    <img
                      src="https://i.ibb.co/4gPZw7Tf/pharmacy-ai-green-white.png"
                      alt="pharmacy ai green white"
                      className="w-full h-full object-contain rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/pharmacy-ai-green-white.png';
                      }}
                    />
                  )}
                </div>
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src="https://i.ibb.co/4gPZw7Tf/pharmacy-ai-green-white.png"
                    alt="pharmacy ai green white"
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = '/pharmacy-ai-green-white.png';
                    }}
                  />
                </div>
                <div className="px-4 py-3 rounded-2xl text-sm bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-primary-600" />
                  <span className="text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your health question..."
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
