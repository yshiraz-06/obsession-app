import { useState, useRef } from 'react';
import { getSystemPrompt, analyzeUserSentiment, getObsessionStage } from '../constants/nikki';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface NikkiState {
  messages: Message[];
  obsessionScore: number;
  obsessionStage: number;
  isTyping: boolean;
  sendMessage: (text: string) => Promise<void>;
}

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export function useNikki(apiKey: string, userName: string = 'you'): NikkiState {
  const [messages, setMessages] = useState<Message[]>([]);
  const [obsessionScore, setObsessionScore] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const scoreRef = useRef(0);

  const obsessionStage = getObsessionStage(obsessionScore);

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Calculate new obsession score based on sentiment
    const sentimentDelta = analyzeUserSentiment(text);
    const newScore = Math.min(140, scoreRef.current + sentimentDelta);
    scoreRef.current = newScore;
    setObsessionScore(newScore);

    setIsTyping(true);

    // Build conversation history for the API
    const allMessages = [...messages, userMessage];
    const apiMessages = allMessages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const currentStage = getObsessionStage(newScore);
      const systemPrompt = getSystemPrompt(currentStage, userName);

      // Simulate realistic typing delay (1.5–3s)
      const typingDelay = 1500 + Math.random() * 1500;
      await new Promise(res => setTimeout(res, typingDelay));

      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          system: systemPrompt,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const replyText = data.content?.[0]?.text ?? "...";

      const nikkiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, nikkiMessage]);
    } catch (err) {
      console.error('Nikki API error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "why aren't you replying to me...",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, obsessionScore, obsessionStage, isTyping, sendMessage };
}