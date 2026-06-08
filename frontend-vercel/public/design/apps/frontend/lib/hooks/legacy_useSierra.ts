'use client';

import { useState, useEffect } from 'react';

export interface SierraMessage {
  id: string;
  sender: 'sierra' | 'user';
  text: string;
  options?: string[];
  field?: string;
}

// Custom lightweight ID generator
const generateId = () => Math.random().toString(36).substring(7);

export function useSierra() {
  const [messages, setMessages] = useState<SierraMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [stakeholderName, setStakeholderName] = useState<string>('Guest');

  // Initialize unique session ID for Investment Stakeholder tracking
  useEffect(() => {
    let id = localStorage.getItem('sierra_session_id');
    if (!id) {
      id = 'web_' + generateId();
      localStorage.setItem('sierra_session_id', id);
    }
    setSessionId(id);

    // Initial warm greetings from Sierra, our master concierge
    setMessages([
      {
        id: 'welcome',
        sender: 'sierra',
        text: "Welcome to Sierra Estates. I am Sierra, your Master AI Concierge. Shall we initiate a search for your next high-yield Portfolio Asset?",
        options: ["Initiate Search", "Just Browsing"]
      }
    ]);
  }, []);

  const addSierraMessage = (text: string, options?: string[]) => {
    setMessages(prev => [
      ...prev,
      {
        id: generateId(),
        sender: 'sierra',
        text,
        options
      }
    ]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: generateId(),
        sender: 'user',
        text
      }
    ]);
  };

  const handleResponse = async (text: string, optionValue?: string) => {
    if (optionValue === 'View Portfolio Assets' || optionValue === 'View Inventory') {
      window.location.href = '/listings';
      return;
    }
    
    addUserMessage(text);
    setIsTyping(true);

    try {
      // Keep track of their name if they mention it or if we prompt
      let name = stakeholderName;
      if (text.toLowerCase().includes('my name is')) {
        const extracted = text.split(/my name is/i)[1]?.trim();
        if (extracted) {
          setStakeholderName(extracted);
          name = extracted;
        }
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text,
          name
        })
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.success && data.reply) {
        // Parse simple markdown options format if any (e.g. "Options: [Opt1, Opt2]")
        const replyText = data.reply;
        let options: string[] = [];

        // Check if agent responded with dynamic selection options or redirect cues
        if (replyText.includes('View Inventory') || replyText.includes('S7') || replyText.includes('Matchmaker')) {
          options = ["View Portfolio Assets"];
        }

        addSierraMessage(replyText, options.length > 0 ? options : undefined);
      } else {
        addSierraMessage("Understood. Connection to our neural network is momentarily adapting. Please retry.");
      }
    } catch (error) {
      console.error("Failed to fetch Sierra Concierge response:", error);
      setIsTyping(false);
      addSierraMessage("I apologize, but my connection to the Sierra Estates matching engine has timed out. Rest assured, our team has been alerted.");
    }
  };

  return {
    messages,
    isTyping,
    handleResponse,
    stage: 'DYNAMIC'
  };
}
