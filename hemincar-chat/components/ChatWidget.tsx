import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatButton } from './ChatButton';
import { ChatWindow } from './ChatWindow';
import { Message, LanguageCode } from '../types';
import { LANGUAGES } from '../constants';
import { geminiService } from '../services/geminiService';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize chat with welcome message when language changes or on mount
  useEffect(() => {
    // Only set welcome message if chat is empty or we specifically want to re-greet on language switch (optional)
    // Here we will clear and add welcome message to make it clean for the demo
    const welcomeMsg: Message = {
      id: 'welcome',
      role: 'model',
      content: LANGUAGES[currentLanguage].welcome,
      timestamp: Date.now(),
    };
    setMessages([welcomeMsg]);
    geminiService.startChat();
  }, [currentLanguage]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Create a placeholder for the bot response
      const botMsgId = uuidv4();
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: 'model',
          content: '', // Start empty for streaming
          timestamp: Date.now(),
        },
      ]);

      const stream = geminiService.sendMessageStream(userMsg.content, LANGUAGES[currentLanguage].name);

      let fullContent = '';

      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMsgId 
              ? { ...msg, content: fullContent } 
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, currentLanguage]);

  return (
    <>
      <ChatWindow
        isOpen={isOpen}
        messages={messages}
        isLoading={isLoading}
        currentLanguage={currentLanguage}
        inputValue={inputValue}
        onLanguageChange={setCurrentLanguage}
        onInputChange={setInputValue}
        onSend={handleSendMessage}
      />
      <ChatButton 
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)} 
        notificationCount={messages.length > 1 && !isOpen ? 1 : 0}
      />
    </>
  );
};