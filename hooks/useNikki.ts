import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSystemPrompt, analyzeUserSentiment, getObsessionStage } from '../constants/nikki';
import { generateLocalReply, generateSpontaneousMessage, generateTimeGapMessage } from '../constants/localEngine';

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
  resetChat: () => Promise<void>;
}

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const POLLINATIONS_API_URL = 'https://text.pollinations.ai/';

export function useNikki(apiKey: string, userName: string = 'you'): NikkiState {
  const [messages, setMessages] = useState<Message[]>([]);
  const [obsessionScore, setObsessionScore] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);
  const scoreRef = useRef(0);
  const initialSentRef = useRef(false);
  const recentSpontaneousRef = useRef<string[]>([]);

  const obsessionStage = getObsessionStage(obsessionScore);

  // 1. Load saved conversation & check for REAL-LIFE TIME GAPS (minutes, hours, days, months)
  useEffect(() => {
    async function loadStorageAndCheckGaps() {
      try {
        const savedMessagesJson = await AsyncStorage.getItem('@nikki_messages');
        const savedScoreStr = await AsyncStorage.getItem('@nikki_score');

        if (savedScoreStr) {
          const s = parseInt(savedScoreStr, 10);
          if (!isNaN(s)) {
            scoreRef.current = s;
            setObsessionScore(s);
          }
        }

        if (savedMessagesJson) {
          const parsed: Message[] = JSON.parse(savedMessagesJson).map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }));

          if (parsed.length > 0) {
            initialSentRef.current = true;
            setMessages(parsed);

            // Check how long since the user last texted or talked
            const lastMsg = parsed[parsed.length - 1];
            const elapsedMs = Date.now() - new Date(lastMsg.timestamp).getTime();

            // If you disappeared for 10+ minutes, hours, days, or months:
            if (elapsedMs >= 10 * 60 * 1000) {
              const currentStage = getObsessionStage(scoreRef.current);
              setIsTyping(true);
              setTimeout(() => {
                const gapText = generateTimeGapMessage(currentStage, userName, elapsedMs, recentSpontaneousRef.current);
                recentSpontaneousRef.current = [gapText, ...recentSpontaneousRef.current].slice(0, 30);
                const gapMsg: Message = {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: gapText,
                  timestamp: new Date(),
                };
                setMessages(prev => [...prev, gapMsg]);
                setIsTyping(false);
              }, 1800);
            }
          }
        }
      } catch (e) {
        console.error('Failed loading storage:', e);
      } finally {
        setLoadedFromStorage(true);
      }
    }

    loadStorageAndCheckGaps();
  }, [userName]);

  // Save messages & score when they change
  useEffect(() => {
    if (!loadedFromStorage) return;
    AsyncStorage.setItem('@nikki_messages', JSON.stringify(messages)).catch(() => {});
    AsyncStorage.setItem('@nikki_score', obsessionScore.toString()).catch(() => {});
  }, [messages, obsessionScore, loadedFromStorage]);

  // 2. Initial Opening Message before the user even texts (if brand new chat)
  useEffect(() => {
    if (!loadedFromStorage) return;
    if (!initialSentRef.current && messages.length === 0) {
      initialSentRef.current = true;
      setIsTyping(true);
      const timer = setTimeout(() => {
        const openingText = generateSpontaneousMessage(obsessionStage, userName, recentSpontaneousRef.current, true);
        recentSpontaneousRef.current = [openingText, ...recentSpontaneousRef.current].slice(0, 30);
        const openingMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: openingText,
          timestamp: new Date(),
        };
        setMessages([openingMessage]);
        setIsTyping(false);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [loadedFromStorage, messages.length]);

  // 3. Active Double-Texting inside the app (Realistic delays across minutes/hours)
  useEffect(() => {
    if (!loadedFromStorage || isTyping || messages.length === 0) return;

    // Significantly increased delays while actively inside the chat:
    // Stage 0 (Sweet): 3.5 minutes (210,000 ms)
    // Stage 1 (Clingy): 2 minutes (120,000 ms)
    // Stage 2 (Unsettling): 1.2 minutes (72,000 ms)
    // Stage 3 (Unhinged): 45 seconds (45,000 ms)
    const idleDelay = [210000, 120000, 72000, 45000][Math.min(obsessionStage, 3)];

    const timer = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const sponText = generateSpontaneousMessage(obsessionStage, userName, recentSpontaneousRef.current, false);
        recentSpontaneousRef.current = [sponText, ...recentSpontaneousRef.current].slice(0, 30);
        
        const sponMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: sponText,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, sponMsg]);
        setIsTyping(false);
      }, 1500);
    }, idleDelay);

    return () => clearTimeout(timer);
  }, [messages, isTyping, obsessionStage, userName, loadedFromStorage]);

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

    const currentStage = getObsessionStage(newScore);
    const systemPrompt = getSystemPrompt(currentStage, userName);

    // Build conversation history for the API
    const allMessages = [...messages, userMessage];
    const apiMessages = allMessages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      // Simulate realistic typing delay (1.2–2.5s)
      const typingDelay = 1200 + Math.random() * 1300;
      await new Promise(res => setTimeout(res, typingDelay));

      let replyText = '';

      // 1. If user provided an Anthropic key explicitly, try Anthropic API
      if (apiKey && apiKey.trim().startsWith('sk-ant-')) {
        const response = await fetch(ANTHROPIC_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey.trim(),
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
        if (data.content?.[0]?.text) {
          replyText = data.content[0].text;
        }
      }

      // 2. Try Free Pollinations AI Endpoint (Hybrid mode) if no Anthropic reply yet
      if (!replyText) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout so AI can fully generate without getting aborted

          const pollResponse = await fetch(POLLINATIONS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
                { role: 'system', content: systemPrompt },
                ...apiMessages,
              ],
              model: 'openai-fast',
              temperature: 0.8,
              seed: Math.floor(Math.random() * 999999)
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (pollResponse.ok) {
            const rawText = await pollResponse.text();
            if (rawText && rawText.trim().length > 0 && !rawText.includes('<html>') && !rawText.includes('504') && !rawText.includes('502')) {
              replyText = rawText.trim();
            }
          }
        } catch (e) {
          // Pollinations failed or timed out, will proceed to local fallback
          console.log('Free API fallback triggered:', e);
        }
      }

      // 3. If API didn't respond, timed out, or returned a repeated text, use Smart Local Engine
      if (!replyText || recentSpontaneousRef.current.includes(replyText.trim())) {
        replyText = generateLocalReply(currentStage, text, userName, recentSpontaneousRef.current);
      }

      recentSpontaneousRef.current = [replyText, ...recentSpontaneousRef.current].slice(0, 30);

      const nikkiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, nikkiMessage]);
    } catch (err) {
      console.error('Nikki Hybrid error:', err);
      const fallbackReply = generateLocalReply(currentStage, text, userName, recentSpontaneousRef.current);
      recentSpontaneousRef.current = [fallbackReply, ...recentSpontaneousRef.current].slice(0, 30);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackReply || "why aren't you replying to me...",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = async () => {
    try {
      await AsyncStorage.removeItem('@nikki_messages');
      await AsyncStorage.removeItem('@nikki_score');
      setMessages([]);
      scoreRef.current = 20;
      setObsessionScore(20);
      initialSentRef.current = false;
      recentSpontaneousRef.current = [];
    } catch (e) {
      console.error('Reset error:', e);
    }
  };

  return { messages, obsessionScore, obsessionStage, isTyping, sendMessage, resetChat };
}