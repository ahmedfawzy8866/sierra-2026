import { useState, useEffect } from 'react';
import { COLLECTIONS, Lead, PipelineStage, StakeholderAcquisitionSource } from '@/lib/models/schema';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type SierraStage = 
  | 'WELCOME' 
  | 'OBJECTIVE' 
  | 'LOCATION' 
  | 'TYPE' 
  | 'BUDGET' 
  | 'CONTACT' 
  | 'FINAL';

export interface SierraMessage {
  id: string;
  sender: 'sierra' | 'user';
  text: string;
  options?: string[];
  field?: keyof Lead | string;
}

export function useSierra() {
  const [stage, setStage] = useState<SierraStage>('WELCOME');
  const [messages, setMessages] = useState<SierraMessage[]>([]);
  const [data, setData] = useState<Partial<Lead>>({
    stage: 'inbound' as PipelineStage,
    source: 'website' as StakeholderAcquisitionSource,
  });
  const [isTyping, setIsTyping] = useState(false);

  const addSierraMessage = (text: string, options?: string[], field?: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: SierraMessage = {
        id: Math.random().toString(36).substring(7),
        sender: 'sierra',
        text,
        options,
        field
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const addUserMessage = (text: string) => {
    const newMessage: SierraMessage = {
      id: Math.random().toString(36).substring(7),
      sender: 'user',
      text
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Initial Welcome
  useEffect(() => {
    if (messages.length === 0) {
      addSierraMessage(
        "Welcome to Sierra Blu. I am Sierra, your Master AI Concierge. Shall we initiate a search for your next high-yield asset?",
        ["Initiate Search", "Just Browsing"]
      );
    }
  }, []);

  const handleResponse = async (text: string, optionValue?: string) => {
    addUserMessage(text);
    
    const currentStage = stage;
    
    switch (currentStage) {
      case 'WELCOME':
        if (text.toLowerCase().includes('initiate') || optionValue === 'Initiate Search') {
          setStage('OBJECTIVE');
          addSierraMessage(
            "Excellent. Are you looking to invest in a Resale unit for immediate delivery, or are you seeking a Primary (Off-plan) development?",
            ["Resale", "Primary / Off-plan"]
          );
        } else {
          addSierraMessage("Understood. I am here if you decide to proceed with a strategic acquisition.");
        }
        break;

      case 'OBJECTIVE':
        setData(prev => ({ ...prev, investmentGoal: text }));
        setStage('LOCATION');
        addSierraMessage(
          "Strategic choice. In New Cairo, which compound matches your vision? We have deep intelligence on Mivida, Marakez, Sodic, and more.",
          ["Mivida", "Marakez", "Sodic East", "Mountain View", "Other"]
        );
        break;

      case 'LOCATION':
        setData(prev => ({ ...prev, preferredLocations: [text] }));
        setStage('TYPE');
        addSierraMessage(
          "Noted. And the unit type? We specialize in Penthouses, Villas, and Apartments with premium views.",
          ["Apartment", "Villa", "Penthouse", "Townhouse"]
        );
        break;

      case 'TYPE':
        setData(prev => ({ ...prev, preferredPropertyType: text.toLowerCase() as any }));
        setStage('BUDGET');
        addSierraMessage(
          "To align our financial intelligence, what is your capital allocation for this asset?",
          ["Under 5M EGP", "5M - 10M EGP", "10M - 20M EGP", "20M+ EGP"]
        );
        break;

      case 'BUDGET':
        setData(prev => ({ ...prev, notes: `Budget: ${text}` }));
        setStage('CONTACT');
        addSierraMessage(
          "One final detail: Please provide your name and phone number so we can link your profile to our VIP neural network and send your personalized portfolio."
        );
        break;

      case 'CONTACT':
        // Basic parsing for Name and Phone
        const parts = text.split(' ');
        const name = parts[0] || 'Inquiry';
        const phone = parts.find(p => /\d{8,}/.test(p)) || text;
        
        const finalData = {
          ...data,
          name,
          phone,
          createdAt: serverTimestamp(),
        };

        try {
          await addDoc(collection(db, COLLECTIONS.stakeholders), finalData);
          setStage('FINAL');
          addSierraMessage(
            `Sync complete, ${name}. Our matching engine is now analyzing the 1,000+ units in our grid. Your personalized portfolio will be ready shortly.`,
            ["View Inventory"]
          );
        } catch (error) {
          console.error("Lead capture failed:", error);
          addSierraMessage("I encountered a synchronization error, but our team has been notified.");
        }
        break;

      case 'FINAL':
        if (text === 'View Inventory') {
          window.location.href = '/inventory';
        }
        break;
    }
  };

  return {
    messages,
    isTyping,
    handleResponse,
    stage
  };
}
