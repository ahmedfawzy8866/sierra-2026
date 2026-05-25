'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Sparkles, Send, User } from 'lucide-react';
import { useSierra } from '@/lib/hooks/useSierra';
import BrandLogo from '@/components/UI/BrandLogo';

/**
 * LEILA CONCIERGE — QUIET LUXURY V12.0
 * The master AI concierge interface for premium lead generation.
 */
export default function SierraConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, isTyping, handleResponse, stage } = useSierra();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const onSend = () => {
    if (!inputValue.trim()) return;
    handleResponse(inputValue);
    setInputValue('');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-[#030712]/95 backdrop-blur-3xl border border-[#C9A24D]/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#C9A24D]/10 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#C9A24D]/30 flex items-center justify-center bg-[#C9A24D]/5 relative">
                  <BrandLogo variant="emblem" size="sm" themeOverride="dark" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#030712] rounded-full" />
                </div>
                <div>
                  <h3 className="text-sm font-serif tracking-[0.2em] uppercase text-[#F4F0E8]">Sierra</h3>
                  <p className="text-[10px] text-[#C9A24D]/60 uppercase tracking-widest font-medium">Master AI Concierge</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[#F4F0E8]/40 hover:text-[#F4F0E8] transition-colors p-2 hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'sierra' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === 'sierra' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] flex gap-3 ${msg.sender === 'sierra' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'sierra' 
                        ? 'bg-[#C9A24D]/10 border border-[#C9A24D]/30 text-[#C9A24D]' 
                        : 'bg-white/10 border border-white/20 text-[#F4F0E8]'
                    }`}>
                      {msg.sender === 'sierra' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'sierra'
                          ? 'bg-[#111827] text-[#F4F0E8] rounded-tl-none border border-white/5 shadow-inner'
                          : 'bg-[#C9A24D] text-[#030712] rounded-tr-none font-medium'
                      }`}>
                        {msg.text}
                      </div>
                      
                      {/* Options */}
                      {msg.sender === 'sierra' && msg.options && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {msg.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleResponse(opt, opt)}
                              className="px-3 py-1.5 rounded-full border border-[#C9A24D]/30 text-[11px] text-[#C9A24D] hover:bg-[#C9A24D] hover:text-[#030712] transition-all uppercase tracking-wider"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-center bg-[#111827] px-4 py-3 rounded-2xl rounded-tl-none border border-white/5">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 bg-[#C9A24D] rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#C9A24D] rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#C9A24D] rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-[#C9A24D]/10 bg-black/20">
              <div className="relative group">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSend()}
                  placeholder="Type your response..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-[#F4F0E8] placeholder-[#F4F0E8]/20 focus:outline-none focus:border-[#C9A24D]/50 transition-all group-hover:border-white/20"
                />
                <button
                  onClick={onSend}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-[#C9A24D] text-[#030712] rounded-xl flex items-center justify-center hover:bg-[#F4F0E8] transition-all disabled:opacity-50"
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-[9px] text-[#C9A24D]/40 uppercase tracking-[0.2em] text-center">
                Institutional Quality Protocol Active
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-[#C9A24D] text-[#030712] shadow-2xl flex items-center justify-center relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        <motion.div
          animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {isOpen ? <X className="w-7 h-7" /> : <BrandLogo variant="emblem" size="sm" themeOverride="dark" />}
        </motion.div>
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F4F0E8] text-[#030712] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#030712] animate-bounce">
            1
          </div>
        )}
      </motion.button>
    </div>
  );
}
