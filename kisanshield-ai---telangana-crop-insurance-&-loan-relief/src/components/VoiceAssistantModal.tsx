import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeContext?: any;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  activeContext,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting =
        language === 'te'
          ? `నమస్కారం ${user?.name || 'రైతు సోదరా'}! నేను కిసాన్‌షీల్డ్ వాయిస్ అసిస్టెంట్‌ని. మీ పంట నష్టం అంచనా వేయడం, భీమా క్లెయిమ్ రాయడం లేదా అవసరమైన పత్రాల గురించి నాతో మాట్లాడండి.`
          : `Namaskaram ${user?.name || 'Farmer'}! I am your KisanShield voice assistant. Speak or ask questions regarding crop damage assessments, PMFBY claim drafting, or required documents.`;

      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: initialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isOpen, language, user]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Set up Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      if (transcript.trim()) {
        handleSendMessage(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [language]);

  const toggleListening = () => {
    if (!speechSupported) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Stop speech synthesis if speaking
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = language === 'te' ? 'te-IN' : 'en-IN';
          recognitionRef.current.start();
        }
      } catch (err) {
        console.warn('Recognition start failed', err);
      }
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 0.95;

    // Look for Telugu voices if available
    const voices = window.speechSynthesis.getVoices();
    const teVoice = voices.find((v) => v.lang.startsWith('te') || v.name.toLowerCase().includes('telugu'));
    if (teVoice) {
      utterance.voice = teVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const resp = await fetch('/api/ai/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          language,
          context: {
            farmerName: user?.name,
            district: user?.district,
            activeContext,
          },
        }),
      });

      const data = await resp.json();
      const answer = data.answer || 'Error getting assistant response';

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      // Speak the answer aloud
      speakText(answer);
    } catch (err) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: language === 'te'
          ? 'క్షమించండి, సర్వర్ స్పందించలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.'
          : 'Sorry, could not connect to assistant. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions =
    language === 'te'
      ? [
          'నా పంట నష్టానికి దరఖాస్తు ఎలా చేయాలి?',
          'క్లెయిమ్‌కు ఏయే పత్రాలు అవసరం?',
          'నా పొలం నష్టం వివరాలు చెప్పండి',
          'బ్యాంక్ సమీక్ష ఎలా జరుగుతుంది?',
        ]
      : [
          'How do I apply for crop damage relief?',
          'What documents do I need for PMFBY?',
          'Explain the weather evidence for my farm',
          'How does the bank review my claim?',
        ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FBF9F4] w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col h-[85vh] sm:h-[680px] border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#153E32] text-white p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3B7C61] flex items-center justify-center text-white shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight font-display">
                {language === 'te' ? 'కిసాన్‌షీల్డ్ వాయిస్ అసిస్టెంట్' : 'KisanShield Voice Assistant'}
              </h3>
              <p className="text-xs text-emerald-200 flex items-center gap-1">
                <span>{language === 'te' ? 'తెలుగు & ఇంగ్లీష్ మద్దతు' : 'Telugu & English Voice Engine'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 text-xs flex items-center gap-1"
                title="Stop audio"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                stopSpeaking();
                if (isListening) recognitionRef.current?.stop();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Safety Note banner */}
        <div className="bg-[#EBF4F0] px-4 py-2 border-b border-[#D5E6DE] text-[11px] text-[#153E32] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#3B7C61] shrink-0" />
          <span>
            {language === 'te'
              ? 'గమనిక: వాయిస్ కమాండ్ ద్వారా ఎటువంటి క్లెయిమ్ నేరుగా సమర్పించబడదు. ప్రతి చర్యకు మీ నిర్ధారణ తప్పనిసరి.'
              : 'Safety: Voice assistant provides guided advice. No financial claim is submitted without your direct confirmation.'}
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#153E32] text-white rounded-br-xs'
                    : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-xs'
                }`}
              >
                <p>{m.text}</p>
                {m.sender === 'assistant' && (
                  <button
                    onClick={() => speakText(m.text)}
                    className="mt-2 text-xs text-[#3B7C61] hover:text-[#153E32] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{language === 'te' ? 'చదివి వినిపించండి' : 'Read Aloud'}</span>
                  </button>
                )}
              </div>
              <span className="text-[10px] text-stone-600 mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-stone-700 text-xs p-2 bg-white rounded-lg border border-stone-200 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#3B7C61] animate-ping" />
              <span>{language === 'te' ? 'సమాధానం విశ్లేషిస్తోంది...' : 'Analyzing case evidence...'}</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2 border-t border-stone-200 bg-white/70 overflow-x-auto">
          <p className="text-[11px] font-semibold text-stone-600 mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
            <span>{language === 'te' ? 'ప్రశ్నల సూచనలు:' : 'Suggested Questions:'}</span>
          </p>
          <div className="flex gap-1.5 flex-nowrap pb-1">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-xs whitespace-nowrap bg-stone-100 hover:bg-[#EBF4F0] hover:text-[#153E32] text-stone-700 px-3 py-1.5 rounded-full border border-stone-200 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Speech / Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200 flex flex-col items-center gap-2">
          {/* Large Voice Button with pulsing effect */}
          <div className="flex items-center gap-3 w-full">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3.5 rounded-full transition-all shadow-md flex items-center justify-center cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white ring-4 ring-red-200 animate-pulse'
                  : 'bg-[#153E32] text-white hover:bg-[#1a4b3d]'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Click to speak in Telugu or English'}
            >
              {isListening ? <Mic className="w-6 h-6 animate-bounce" /> : <Mic className="w-6 h-6" />}
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder={
                  isListening
                    ? language === 'te'
                      ? 'వింటున్నాము... మాట్లాడండి...'
                      : 'Listening... speak now...'
                    : language === 'te'
                    ? 'ఇక్కడ టైప్ చేయండి లేదా మాట్లాడండి...'
                    : 'Type or speak your question in Telugu or English...'
                }
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#153E32] focus:ring-1 focus:ring-[#153E32] text-sm bg-stone-50"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
                className="absolute right-2 top-2 p-1 text-[#153E32] hover:bg-stone-200 rounded-lg disabled:text-stone-300 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-[11px] text-stone-600 flex items-center justify-between w-full px-1">
            <span>
              {isListening
                ? language === 'te'
                  ? 'మైక్రోఫోన్ ఆన్‌లో ఉంది (మాట్లాడండి)'
                  : 'Microphone is active (Speaking...)'
                : language === 'te'
                ? 'వాయిస్ కోసం పెద్ద బటన్ నొక్కండి'
                : 'Click mic button to speak'}
            </span>
            {!speechSupported && (
              <span className="text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Web Speech not supported in this browser. Text mode active.</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
