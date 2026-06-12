'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import Link from 'next/link';

type Sender = 'bot' | 'user';

interface ChatPlace {
  id: string;
  name: string;
  area: string;
  category: string;
  rating: number;
  budget: string;
  photoUrl?: string;
  googleMapsUrl: string;
  insiderTip: string;
}

interface ChatAction {
  label: string;
  href: string;
}

interface Message {
  id: string;
  sender: Sender;
  text: string;
  places?: ChatPlace[];
  actions?: ChatAction[];
  suggestions?: string[];
}

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  sender: 'bot',
  text: "Vanakkam! I'm your Chennai weekend planner. Ask me for spots, vibes, or hit 'Build me a plan'.",
  suggestions: ['Best beaches', 'Chill date spot', 'Foodie places in Nungambakkam', 'Build me a plan'],
};

const BUDGET_LABEL: Record<string, string> = {
  free: 'Free',
  'under-500': '≤ ₹500',
  'under-2000': '≤ ₹2000',
  'no-limit': '₹₹₹',
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: data.reply || "Hmm, no response.",
        places: data.places,
        actions: data.actions,
        suggestions: data.suggestions,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-err-${Date.now()}`,
          sender: 'bot',
          text: "Network glitch. Try again?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className={`fixed z-50 bottom-5 right-5 sm:bottom-6 sm:right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          open
            ? 'bg-[#0F172A] text-white rotate-90'
            : 'bg-[#F43F5E] hover:bg-[#E11D48] text-white hover:scale-105'
        }`}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed z-50 bottom-24 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-[380px] max-w-[400px] h-[560px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-[#0F172A] text-white px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F43F5E] flex items-center justify-center shadow-md">
            <span className="text-white font-black text-base">W</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm">Weekendaa Bot</span>
            <span className="text-[10px] tracking-[0.2em] text-white/50">CHENNAI PLANNER</span>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-slate-50">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} onSuggest={send} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <form onSubmit={onSubmit} className="border-t border-slate-200 bg-white p-3 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for spots, vibes, plans…"
            className="flex-1 px-3 py-2.5 text-sm bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#F43F5E]/40 focus:bg-white transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send"
            className="w-10 h-10 rounded-xl bg-[#F43F5E] hover:bg-[#E11D48] disabled:bg-slate-300 text-white flex items-center justify-center transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}

function MessageBubble({ msg, onSuggest }: { msg: Message; onSuggest: (s: string) => void }) {
  const isUser = msg.sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 text-sm whitespace-pre-line shadow-sm ${
            isUser
              ? 'bg-[#0F172A] text-white rounded-2xl rounded-br-sm'
              : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm'
          }`}
        >
          {msg.text}
        </div>

        {msg.places && msg.places.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            {msg.places.map((p) => (
              <a
                key={p.id}
                href={p.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 bg-white border border-slate-200 rounded-xl p-2.5 hover:border-[#F43F5E] hover:shadow-md transition-all"
              >
                {p.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.photoUrl}
                    alt={p.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-slate-100"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-900 truncate">{p.name}</div>
                  <div className="text-xs text-slate-500 truncate">{p.area} • ★ {p.rating.toFixed(1)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{BUDGET_LABEL[p.budget] || p.budget}</div>
                </div>
              </a>
            ))}
          </div>
        )}

        {msg.actions && msg.actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {msg.actions.map((a) => (
              <Link
                key={a.href + a.label}
                href={a.href}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#0F172A] text-white hover:bg-[#1e293b] transition-colors"
              >
                {a.label} →
              </Link>
            ))}
          </div>
        )}

        {msg.suggestions && msg.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {msg.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSuggest(s)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-[#F43F5E] hover:text-[#F43F5E] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
