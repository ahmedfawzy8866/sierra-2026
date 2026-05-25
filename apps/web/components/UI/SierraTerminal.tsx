"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, User, Brain } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'sierra' | 'user';
  text: string;
  isVIP?: boolean;
}

export default function SierraTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        sender: 'sierra',
        text: 'Sierra System Online. Awaiting client criteria to initiate matching and agent delegation protocol.'
      }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMsg = inputValue.trim();
    setInputValue('');
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsg
    }]);
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent/hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: 'SIERRA_CORE', message: userMsg })
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'sierra',
        text: data.response || "Error communicating with Sierra Core.",
        isVIP: data.vipAlert
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'sierra',
        text: "Sierra Core is currently offline."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            key="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-navy text-gold flex items-center justify-center shadow-2xl border-2 border-gold/30 hover:border-gold transition-colors"
          >
            <div className="absolute inset-0 bg-gold/10 rounded-full animate-ping opacity-20" />
            <Brain size={28} />
          </motion.button>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 sm:w-96 h-[32rem] bg-[#0A1A3A] border border-gold/20 shadow-2xl shadow-navy/50 flex flex-col overflow-hidden"
            style={{ borderRadius: '24px' }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gold/10 flex items-center justify-between bg-black/20 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                  <Sparkles size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-white font-serif font-bold text-lg leading-none m-0">Sierra</h3>
                  <span className="text-[10px] text-gold uppercase tracking-widest font-bold">Master Operational Architecture</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" dir="auto">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'sierra' 
                      ? 'bg-gold/10 border border-gold/30 text-gold' 
                      : 'bg-white/10 border border-white/20 text-white'
                  }`}>
                    {msg.sender === 'sierra' ? <Sparkles size={14} /> : <User size={14} />}
                  </div>
                  <div className={`px-4 py-3 text-sm ${
                    msg.sender === 'sierra'
                      ? 'bg-[#1a2b53] text-slate-200 rounded-2xl rounded-tl-sm border border-white/5'
                      : 'bg-gold text-navy font-medium rounded-2xl rounded-tr-sm'
                  }`}>
                    {msg.text}
                    {msg.isVIP && (
                      <div className="mt-3 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-red-500">VIP Intake Alert</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-3 flex-row">
                   <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center">
                    <Sparkles size={14} />
                  </div>
                  <div className="px-4 py-3 bg-[#1a2b53] rounded-2xl rounded-tl-sm flex items-center gap-1">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-gold" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-gold" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gold/10 bg-black/20">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-full ps-5 pe-14 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-gold/50 transition-colors"
                  dir="auto"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute end-2 w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center hover:bg-white disabled:opacity-50 transition-colors"
                >
                  <Send size={14} className="-ms-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
