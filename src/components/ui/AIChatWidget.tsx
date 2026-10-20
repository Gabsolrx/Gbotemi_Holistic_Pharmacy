import { useState, useRef, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Loader2, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am Gbotemi Holistic Pharmacy\'s certified AI Assistant. How can I help you today with medications, health questions, or navigating our pharmacy services?'
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

  const quickPrompts = [
    'How do I upload a prescription?',
    'Book a pharmacist consultation',
    'Can I order prescription medicines?',
    'Payment & delivery options',
    'Free health tools'
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const generateLocalFallback = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('prescription') && (q.includes('upload') || q.includes('send') || q.includes('how'))) {
      return `You can easily upload your prescription right here on our website!

Visit our [Upload Prescription](/prescription) page, snap a clear photo or select a PDF of your doctor's prescription, and submit it. Our licensed pharmacist will review it promptly and prepare your medications for dispatch.`;
    }
    if (q.includes('consult') || q.includes('pharmacist') || q.includes('talk') || q.includes('speak') || q.includes('session')) {
      return `You can consult directly with our qualified holistic pharmacists from the comfort of your home!

Go to [Book a Consultation](/consultation) to schedule a session via WhatsApp, Phone Call, or Video. You can also message us directly on [WhatsApp (+234 802 966 0153)](https://wa.me/2348029660153).`;
    }
    if (q.includes('restrict') || q.includes('prescription drug') || q.includes('can i buy') || q.includes('can i order')) {
      return `At Gbotemi Holistic Pharmacy, we don't arbitrarily restrict your access to needed medications. 

You are welcome to order or request any medication through our [Shop](/shop) or submit your details. Our on-duty licensed pharmacist will review your order and consult with you during checkout or consultation to determine whether a formal doctor's prescription is required. 

Feel free to [Upload your Prescription](/prescription) or [Consult our Pharmacist](/consultation) anytime!`;
    }
    if (q.includes('pay') || q.includes('bank') || q.includes('transfer') || q.includes('delivery')) {
      return `Here are our payment and delivery options:

- **Direct Bank Transfer (Moniepoint MFB)**:
  - Bank: Moniepoint Microfinance Bank
  - Account Name: Gbotemi Holistic Pharmacy
  - Account Number: 8029660153
  Upload your receipt during checkout, and it will be sent to WhatsApp with your order details!
- **Cash / Pay on Delivery**: Available for verified deliveries across Osun State.
- **Delivery**: Fast delivery across Osun State and interstate delivery across Nigeria. **Free delivery on orders above ₦10,000!**

Read more on our [Delivery Information](/delivery-information) page.`;
    }
    if (q.includes('tool') || q.includes('bmi') || q.includes('blood pressure') || q.includes('reminder')) {
      return `We offer several free health and wellness tools!

Check out our [Free Health Tools](/health-tools) to use our:
- BMI Calculator
- Blood Pressure Stage Classifier & Lifestyle Guidance
- Medication Refill Reminder scheduler`;
    }
    if (q.includes('admin') || q.includes('dashboard') || q.includes('staff')) {
      return `Authorized pharmacy staff can access the administrative portal at [Admin Dashboard](/admin) or [Admin Login](/admin/login).`;
    }
    return `Welcome to Gbotemi Holistic Pharmacy!

You can explore our store and services using the following links:
- [Browse Shop Products](/shop)
- [Product Categories](/categories)
- [Upload Prescription](/prescription)
- [Book Pharmacist Consultation](/consultation)
- [Free Health Tools](/health-tools)
- [Contact Pharmacy Support](/contact) or WhatsApp [+234 802 966 0153](https://wa.me/2348029660153)

How else may our healthcare team assist you today?`;
  };

  const handleSubmit = async (e: FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = customText || input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: history.slice(1)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response
        }]);
      } else {
        // Fallback to intelligent local training
        const fallback = generateLocalFallback(userMessage.content);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fallback
        }]);
      }
    } catch (error) {
      console.warn('Network chat fallback to local assistant:', error);
      const fallback = generateLocalFallback(userMessage.content);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallback
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render markdown links and bold formatting cleanly
  const renderMessageContent = (content: string) => {
    // Split into lines
    const lines = content.split('\n');

    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, lineIdx) => {
          if (!line.trim()) {
            return <div key={lineIdx} className="h-1.5" />;
          }

          // Parse markdown links [text](url) and **bold**
          const parts: (string | { type: 'link'; text: string; url: string } | { type: 'bold'; text: string })[] = [];
          
          // Regex for [link](url)
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          let lastIndex = 0;
          let match;

          while ((match = linkRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
              parts.push(line.substring(lastIndex, match.index));
            }
            parts.push({ type: 'link', text: match[1], url: match[2] });
            lastIndex = match.index + match[0].length;
          }

          if (lastIndex < line.length) {
            parts.push(line.substring(lastIndex));
          }

          return (
            <p key={lineIdx}>
              {parts.map((part, pIdx) => {
                if (typeof part === 'string') {
                  // Render bold within string if any
                  if (part.includes('**')) {
                    const boldParts = part.split('**');
                    return boldParts.map((sub, sIdx) => 
                      sIdx % 2 === 1 ? <strong key={sIdx} className="font-semibold text-gray-900">{sub}</strong> : sub
                    );
                  }
                  return part;
                }
                if (part.type === 'link') {
                  const isExternal = part.url.startsWith('http');
                  return (
                    <a
                      key={pIdx}
                      href={part.url}
                      onClick={(e) => {
                        if (!isExternal) {
                          e.preventDefault();
                          navigate(part.url);
                        }
                      }}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="font-semibold text-primary-700 hover:text-primary-900 underline inline-flex items-center gap-0.5 mx-0.5 transition-colors"
                    >
                      {part.text}
                    </a>
                  );
                }
                return null;
              })}
            </p>
          );
        })}
      </div>
    );
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
        <img
          src="https://i.ibb.co/4gPZw7Tf/pharmacy-ai-green-white.png"
          alt="pharmacy ai green white"
          className="w-full h-full object-contain rounded-full select-none relative z-10 drop-shadow-xs"
          onError={(e) => {
            e.currentTarget.src = '/pharmacy-ai-green-white.png';
          }}
        />

        <span 
          className="absolute inset-0 rounded-full bg-emerald-500 opacity-35 animate-ping pointer-events-none" 
          style={{ animationDuration: '2s' }} 
        />
        <span className="absolute -inset-1 rounded-full border-2 border-emerald-500/40 animate-pulse pointer-events-none" />

        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3.5 py-2 bg-gray-900/95 text-white text-xs sm:text-sm font-medium rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg flex items-center gap-2 z-20">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Ask AI Health Assistant</span>
        </div>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 w-[92vw] sm:w-[420px] h-[540px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50 transition-all duration-300 origin-bottom-right overflow-hidden ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-800 to-primary-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shadow-xs flex-shrink-0 bg-white/10 p-0.5">
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
                <span className="text-[10px] bg-emerald-500/30 text-emerald-100 px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5">
                  <Sparkles size={10} /> Certified
                </span>
              </h3>
              <p className="text-xs text-primary-100">Licensed Pharmacy Guidance</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-primary-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close Assistant"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-emerald-50/60 border-b border-emerald-100/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(p);
                handleSubmit(undefined as any, p);
              }}
              className="px-2.5 py-1 text-[11px] font-medium bg-white border border-emerald-200 text-emerald-800 rounded-full hover:bg-emerald-100/80 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                  msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-transparent'
                }`}>
                  {msg.role === 'user' ? (
                    <User size={15} />
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
                <div className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                }`}>
                  {msg.role === 'assistant' ? renderMessageContent(msg.content) : msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src="https://i.ibb.co/4gPZw7Tf/pharmacy-ai-green-white.png"
                    alt="pharmacy ai green white"
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = '/pharmacy-ai-green-white.png';
                    }}
                  />
                </div>
                <div className="px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-primary-600" />
                  <span className="text-gray-500">Checking pharmacy clinical database...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about medications, prescriptions, or services..."
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
