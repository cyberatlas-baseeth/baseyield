'use client';

import React from 'react';

interface ExamplePromptsProps {
  onSelect: (prompt: string) => void;
}

export default function ExamplePrompts({ onSelect }: ExamplePromptsProps) {
  const prompts = [
    { text: 'Best USDC yield on Base', icon: '🏆' },
    { text: 'Top 5 yield opportunities', icon: '📊' },
    { text: 'Safe high APY options', icon: '🛡️' },
    { text: 'Compare ETH yields', icon: '🔄' }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-3xl mx-auto px-4 py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#0052FF] to-[#3b82f6] shadow-lg shadow-[#0052FF]/20 mb-6 pulse-dot">
        <span className="text-3xl">⚡</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#0a0e27] mb-8 text-center">
        What yield opportunity are you looking for on Base?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelect(`${prompt.icon} ${prompt.text}`)}
            className={`flex items-center gap-3 p-4 text-left group card ${index === 0 ? 'card-accent' : ''}`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">{prompt.icon}</span>
            <span className="font-medium text-sm sm:text-base text-[#4b5563] group-hover:text-[#0a0e27]">{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
