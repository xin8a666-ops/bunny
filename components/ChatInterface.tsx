import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithChef } from '../services/geminiService';
import { IconSend, IconBunnyLogo } from './Icons';

interface ChatInterfaceProps {
  history: ChatMessage[];
  setHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ history, setHistory }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await chatWithChef(history, userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };
      
      setHistory(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
         id: (Date.now() + 1).toString(),
         role: 'model',
         text: "(｡•́︿•̀｡) 哎呀！魔法失灵了。请再试一次吧！",
         timestamp: Date.now(),
      };
      setHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cute-bg">
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-80">
            <div className="mb-4 animate-bounce">
                <IconBunnyLogo className="w-24 h-24 drop-shadow-md" />
            </div>
            <p className="text-cute-text font-bold text-lg">我是 Bunny 小兔！(🐰✧)</p>
            <p className="text-sm text-cute-subtext mt-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-cute-border">
                想问什么烘焙问题都可以哦~<br/>比如 "怎么做松软的戚风蛋糕？"
            </p>
          </div>
        )}
        
        {history.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-3xl shadow-sm text-sm leading-relaxed border-2 ${
                msg.role === 'user'
                  ? 'bg-cute-pink text-white border-cute-pink rounded-tr-none'
                  : 'bg-white text-cute-text border-cute-blue rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm border-2 border-cute-blue">
               <div className="flex space-x-2">
                 <div className="w-2 h-2 bg-cute-blueDark rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-cute-blueDark rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-cute-blueDark rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 pb-28 bg-white/80 backdrop-blur-sm border-t border-cute-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="告诉 Bunny 你想知道什么..."
            className="flex-1 bg-cute-bg border-2 border-cute-border rounded-full px-5 py-3 text-sm text-cute-text focus:outline-none focus:border-cute-pink focus:ring-2 focus:ring-cute-pink/20 transition-all placeholder-cute-subtext/70"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-cute-pink text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cute-pinkDark transition-all shadow-cute hover:shadow-cute-hover active:shadow-cute-active active:translate-y-1 border-2 border-cute-pinkDark"
          >
            <IconSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};