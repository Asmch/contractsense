"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon, Loader2, Sparkles, AlertTriangle, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTED_QUESTIONS = [
  "Who owns the IP?",
  "What happens if I miss payment?",
  "What are my biggest risks?",
  "Are there hidden penalties?",
  "What clauses should I negotiate?",
  "Summarize in simple English",
  "Can the other party terminate?",
  "What notice period is required?",
  "What legal jurisdiction applies?",
  "What are the confidentiality obligations?"
];

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ContractChat({ contractId }: { contractId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, append } = useChat({
    api: `/api/contracts/${contractId}/chat`,
    body: { sessionId },
    onResponse: (response) => {
      const newSessionId = response.headers.get("x-chat-session-id");
      if (newSessionId && !sessionId) {
        setSessionId(newSessionId);
      }
    }
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSuggestedClick = (question: string) => {
    append({ role: "user", content: question });
  };

  // Pre-process content to convert Clause mentions to markdown links
  const preprocessContent = (content: string) => {
    return content.replace(/(Clause \d+|Source: Clause \d+)/gi, (match) => {
      const numMatch = match.match(/\d+/);
      const num = numMatch ? numMatch[0] : "";
      return `[${match.replace(/Source:\s*/i, "")}](#clause-${num})`;
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl flex items-center justify-center hover:scale-105 transition-all z-50 group"
      >
        <MessageSquare className="w-6 h-6 group-hover:hidden" />
        <Sparkles className="w-6 h-6 hidden group-hover:block" />
        {/* Notification dot if needed */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 w-full md:w-[400px] md:max-w-[400px] h-[100dvh] md:h-[600px] z-[100] flex flex-col bg-white border-0 md:border md:border-border/50 rounded-none md:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 md:slide-in-from-bottom-5">
      
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-secondary/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground text-sm">Contract Assistant</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Gemini 2.5 Flash</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center hover:bg-secondary/10 text-muted-foreground transition-colors min-h-[44px] md:min-h-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-zinc-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-2">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-foreground font-medium mb-2">Ask anything about this contract</h4>
              <p className="text-sm text-muted-foreground">I've analyzed the entire document and can answer questions, summarize risks, or clarify legal jargon.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                <button 
                  key={i}
                  onClick={() => handleSuggestedClick(q)}
                  className="text-xs bg-white border border-border/50 text-foreground px-3 py-1.5 rounded-full shadow-sm hover:border-primary/50 hover:text-primary transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, index) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
              }`}>
                {m.role === "user" ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user" 
                  ? "bg-secondary text-secondary-foreground rounded-tr-none" 
                  : "bg-white border border-border/50 text-foreground shadow-sm rounded-tl-none prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-secondary/5 prose-a:no-underline"
              }`}>
                {m.role === "assistant" && m.content.includes("This contract does not specify that.") && (
                  <div className="flex items-center gap-2 text-orange-600 bg-orange-500/10 px-3 py-1.5 rounded-lg mb-3 text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" /> Information Missing from Document
                  </div>
                )}
                {m.role === "assistant" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({node, ...props}) => {
                        if (props.href?.startsWith('#clause-')) {
                          const num = props.href.split('-')[1];
                          return (
                            <button 
                              onClick={(e) => {
                                 e.preventDefault();
                                 window.dispatchEvent(new CustomEvent('scroll-to-clause', { detail: { clauseOrder: parseInt(num) } }));
                              }}
                              className="inline-flex items-center px-1.5 py-0.5 mx-1 rounded text-[10px] font-bold tracking-wider uppercase bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
                            >
                              {props.children}
                            </button>
                          );
                        }
                        return <a {...props} className="text-primary hover:underline" />;
                      }
                    }}
                  >
                    {preprocessContent(m.content)}
                  </ReactMarkdown>
                ) : (
                  m.content
                )}
              </div>
            </motion.div>
          ))
        )}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-border/50 shadow-sm rounded-2xl rounded-tl-none px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Carousel (only if chat has started to give ideas) */}
      {messages.length > 0 && !isLoading && (
         <div className="px-4 py-3 bg-white border-t border-border/50 overflow-x-auto custom-scrollbar flex gap-2 whitespace-nowrap">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button 
                key={i}
                onClick={() => handleSuggestedClick(q)}
                className="text-xs shrink-0 bg-secondary/5 border border-border/50 text-muted-foreground px-3 py-1.5 rounded-full hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
              >
                {q}
              </button>
            ))}
         </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-border/50 shrink-0">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question about the contract..."
            className="w-full bg-secondary/5 border border-border/50 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-1.5 p-2 bg-primary text-primary-foreground rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
