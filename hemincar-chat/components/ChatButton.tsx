import React from 'react';
import { MessageCircle, X } from 'lucide-react';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  notificationCount?: number;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ isOpen, onClick, notificationCount = 0 }) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-50 
        w-16 h-16 rounded-full 
        bg-gradient-to-br from-brand-start to-brand-end
        text-white shadow-lg hover:shadow-2xl hover:scale-105
        transition-all duration-300 ease-in-out
        flex items-center justify-center
        focus:outline-none focus:ring-4 focus:ring-purple-300
      `}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
        {isOpen ? (
          <X size={32} strokeWidth={2.5} />
        ) : (
          <MessageCircle size={32} strokeWidth={2.5} />
        )}
      </div>

      {/* Notification Badge */}
      {!isOpen && notificationCount > 0 && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold border-2 border-white">
          {notificationCount}
        </span>
      )}
    </button>
  );
};