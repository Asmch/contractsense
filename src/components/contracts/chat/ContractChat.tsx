"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon, Loader2, Sparkles, AlertTriangle, X, MessageSquare, ChevronDown, PenTool, Mail, FileText, ArrowRight, CheckCircle2, Lock, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ChatMode = "EASY_TO_UNDERSTAND" | "BUSINESS_ADVICE" | "NEGOTIATION_HELP" | "DETAILED_EXPLANATION";

const CHAT_MODES: { id: ChatMode; label: string; icon: string }[] = [
  { id: "EASY_TO_UNDERSTAND", label: "Easy to Understand", icon: "🌱" },
  { id: "BUSINESS_ADVICE", label: "Business Advice", icon: "💼" },
  { id: "NEGOTIATION_HELP", label: "Negotiation Help", icon: "🤝" },
  { id: "DETAILED_EXPLANATION", label: "Detailed Explanation", icon: "📚" }
];

const CATEGORIZED_QUESTIONS = [
  {
    category: "📋 Before Signing",
    questions: [
      "Can I confidently sign this agreement?",
      "What's the biggest thing I should worry about?",
      "Explain this like I'm completely new.",
      "Give me a 30-second summary."
    ]
  },
  {
    category: "💬 Negotiation",
    questions: [
      "Which clauses should I negotiate?",
      "What should I ask the other party to change?",
      "Rewrite this clause in a fair way.",
      "Which changes are most likely to be accepted?"
    ]
  },
  {
    category: "⚖ Risk Review",
    questions: [
      "What's the worst-case scenario?",
      "Which clause could cost me money?",
      "What happens if something goes wrong?",
      "Are there any hidden risks?"
    ]
  },
  {
    category: "🧑‍💼 Practical Advice",
    questions: [
      "What would you do if you were in my position?",
      "Should I ask a lawyer before signing?",
      "Is this agreement common?",
      "What important protections are missing?"
    ]
  }
];

const FOLLOW_UP_CHIPS = [
  "😊 Simpler",
  "📖 More Detail",
  "🧒 Explain Like I'm 15",
  "💼 Business Impact",
  "What should I negotiate?"
];

export function ContractChat({ contractId, apiEndpoint, defaultOpen = false }: { contractId: string, apiEndpoint?: string, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>("EASY_TO_UNDERSTAND");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, append } = useChat({
    api: apiEndpoint || `/api/contracts/${contractId}/chat`,
    body: { sessionId, mode: chatMode },
    onResponse: (response) => {
      const newSessionId = response.headers.get("x-chat-session-id");
      if (newSessionId && !sessionId) {
        setSessionId(newSessionId);
      }
    }
  });

  // Listen for external open/ask events from the Dashboard
  useEffect(() => {
    const handleAskClause = (e: CustomEvent) => {
      setIsOpen(true);
      const clauseText = e.detail.clauseTitle ? `Clause ${e.detail.clauseOrder} (${e.detail.clauseTitle})` : `Clause ${e.detail.clauseOrder}`;
      setTimeout(() => {
        append({ role: "user", content: `Can you explain ${clauseText} to me? Is it normal?` });
      }, 100);
    };

    window.addEventListener('ask-clause', handleAskClause as EventListener);
    return () => window.removeEventListener('ask-clause', handleAskClause as EventListener);
  }, [append]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSuggestedClick = (question: string) => {
    append({ role: "user", content: question });
  };

  const handleActionClick = (action: string) => {
    append({ role: "user", content: action });
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
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 w-full md:w-[450px] md:max-w-[450px] h-[100dvh] md:h-[700px] z-[100] flex flex-col bg-white border-0 md:border md:border-border/50 rounded-none md:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 md:slide-in-from-bottom-5">
      
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-secondary/5 flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground text-sm">🤖 Ask Your AI Contract Advisor</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-600/70" />
                Private & Secure
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center hover:bg-secondary/10 text-muted-foreground transition-colors min-h-[44px] md:min-h-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-zinc-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h4 className="text-foreground font-semibold mb-2">I'm your AI Contract Advisor.</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">Ask anything about your agreement in plain English. Your questions stay connected only to this agreement.</p>
            </div>
            
            <div className="space-y-6 pb-4">
              {CATEGORIZED_QUESTIONS.map((cat, idx) => (
                <div key={idx}>
                  <h5 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">{cat.category}</h5>
                  <div className="flex flex-col gap-2">
                    {cat.questions.map((q, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSuggestedClick(q)}
                        className="text-[13px] font-medium bg-white border border-border/50 text-foreground/80 px-4 py-2.5 rounded-xl shadow-sm hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all text-left flex items-center justify-between group"
                      >
                        {q}
                        <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, index) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className={`flex gap-3 max-w-[90%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
                }`}>
                  {m.role === "user" ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user" 
                    ? "bg-secondary text-secondary-foreground rounded-tr-none" 
                    : "bg-white border border-border/50 text-foreground shadow-sm rounded-tl-none prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-secondary/5 prose-a:no-underline prose-hr:border-border/50 prose-hr:my-3 prose-strong:text-slate-800"
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
              </div>

              {/* Related Questions (Only show on the latest AI message) */}
              {m.role === "assistant" && index === messages.length - 1 && !isLoading && (
                <div className="pl-11 pr-4 mt-2 w-full">
                   <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-widest">Related Questions</p>
                   <div className="flex flex-wrap gap-2">
                     {[
                       "Can you explain that more simply?",
                       "What is the business impact?",
                       "How should I negotiate this?",
                       "Are there any hidden risks?",
                       "Rewrite this fairly for me."
                     ].map((q, idx) => (
                       <button
                         key={idx}
                         onClick={() => handleActionClick(q)}
                         className="text-xs font-medium bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full shadow-sm hover:border-slate-300 hover:text-slate-900 transition-colors"
                       >
                         {q}
                       </button>
                     ))}
                   </div>
                </div>
              )}
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

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-border/50 shrink-0">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about any clause, risk, or negotiation..."
            className="w-full bg-secondary/5 border border-border/50 rounded-full pl-4 pr-12 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
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
        <div className="mt-3 text-[10px] text-muted-foreground text-center leading-relaxed">
          <Shield className="w-3 h-3 inline-block mr-1 text-emerald-600/70 -mt-0.5" />
          ContractSense helps you understand contracts and identify important issues. 
          For important legal decisions, consider speaking with a qualified legal professional.
        </div>
      </form>
    </div>
  );
}
