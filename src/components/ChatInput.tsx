'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="p-4 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/90 to-transparent">
      <div className="max-w-3xl mx-auto relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0052FF]/50 to-[#3b82f6]/50 rounded-2xl blur opacity-30 group-focus-within:opacity-100 transition duration-500"></div>
        <div className={`relative flex items-end gap-2 bg-[#1a1f3c]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Base yields..."
            className="flex-1 max-h-[120px] min-h-[44px] bg-transparent text-white placeholder-gray-400 resize-none outline-none py-2.5 px-3 rounded-xl scrollbar-thin scrollbar-thumb-white/10"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-[#0052FF] text-white disabled:opacity-50 disabled:bg-gray-600 hover:bg-[#0052FF]/90 transition-colors duration-200"
          >
            <span className="text-xl leading-none -mt-0.5">➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}
