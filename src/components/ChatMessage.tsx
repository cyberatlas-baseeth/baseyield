'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-sm shadow-lg ${isUser ? 'bg-gradient-to-br from-[#0052FF] to-[#3b82f6]' : 'bg-[#1a1f3c] border border-white/10'}`}>
          {isUser ? '🧑' : '⚡'}
        </div>
        
        <div className={`px-5 py-3 rounded-2xl ${
          isUser 
            ? 'bg-gradient-to-br from-[#0052FF] to-[#3b82f6] text-white rounded-tr-sm shadow-md' 
            : 'bg-[#1a1f3c]/80 backdrop-blur-sm text-gray-200 border border-white/10 rounded-tl-sm shadow-md'
        }`}>
          {isUser ? (
            <div className="whitespace-pre-wrap">{content}</div>
          ) : (
            <div className="markdown-content prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-[#0a0e27] prose-pre:border prose-pre:border-white/10 prose-a:text-[#0052FF] prose-strong:text-white">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
