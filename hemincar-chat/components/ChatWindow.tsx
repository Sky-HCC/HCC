import React, { useRef, useEffect, useState } from 'react';
import { Send, Globe } from 'lucide-react';
import { Message, LanguageCode } from '../types';
import { LANGUAGES } from '../constants';

interface ChatWindowProps {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  currentLanguage: LanguageCode;
  inputValue: string;
  onLanguageChange: (lang: LanguageCode) => void;
  onInputChange: (val: string) => void;
  onSend: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  messages,
  isLoading,
  currentLanguage,
  inputValue,
  onLanguageChange,
  onInputChange,
  onSend,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const config = LANGUAGES[currentLanguage];
  const isRTL = config.dir === 'rtl';

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`
        fixed bottom-[100px] right-4 md:right-6 z-40
        w-[90vw] md:w-[380px] h-[600px] max-h-[80vh]
        bg-white rounded-2xl shadow-2xl
        flex flex-col overflow-hidden
        origin-bottom-right animate-slide-up
        border border-gray-100
      `}
      dir={config.dir}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-start to-brand-end p-4 flex justify-between items-center text-white shrink-0">
        <div className="flex flex-col">
          <h3 className="font-bold text-lg">{config.title}</h3>
          <span className="text-xs text-purple-100 opacity-90">Online</span>
        </div>
        
        <div className="relative">
            <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors flex items-center gap-1 focus:outline-none"
            >
                <Globe size={18} />
                <span className="text-sm font-medium uppercase">{currentLanguage}</span>
            </button>
            
            {/* Language Dropdown */}
            {isLangMenuOpen && (
                <div className={`
                    absolute top-full ${isRTL ? 'left-0' : 'right-0'} mt-2 
                    bg-white text-gray-800 rounded-lg shadow-xl py-2 w-32 
                    z-50 animate-fade-in border border-gray-100
                `}>
                    {Object.values(LANGUAGES).map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                onLanguageChange(lang.code as LanguageCode);
                                setIsLangMenuOpen(false);
                            }}
                            className={`
                                block w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors
                                ${currentLanguage === lang.code ? 'font-bold text-purple-700' : ''}
                                ${isRTL ? 'text-right' : 'text-left'}
                            `}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((msg) => (
            <div
                key={msg.id}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <div
                    className={`
                        max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                        ${msg.role === 'user' 
                            ? 'bg-gradient-to-r from-brand-start to-brand-end text-white rounded-br-none' 
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}
                    `}
                >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
            </div>
        ))}
        
        {isLoading && (
            <div className="flex justify-start w-full animate-fade-in">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-2 relative">
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={config.placeholder}
                className={`
                    w-full py-3 px-4 rounded-full bg-gray-100 
                    focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-white 
                    transition-all duration-200 text-sm
                    ${isRTL ? 'pr-4 pl-12' : 'pl-4 pr-12'}
                `}
                disabled={isLoading}
            />
            <button
                onClick={onSend}
                disabled={!inputValue.trim() || isLoading}
                className={`
                    absolute ${isRTL ? 'left-2' : 'right-2'} 
                    p-2 rounded-full 
                    ${!inputValue.trim() || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-start hover:bg-brand-end cursor-pointer'}
                    text-white transition-all duration-200
                    flex items-center justify-center
                `}
            >
                <Send size={18} />
            </button>
        </div>
        <div className="text-center mt-2">
           <span className="text-[10px] text-gray-400">Powered by HeminCar AI</span>
        </div>
      </div>
    </div>
  );
};