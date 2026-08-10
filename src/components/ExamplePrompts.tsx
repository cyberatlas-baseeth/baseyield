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
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#0052FF] to-[#3b82f6] shadow-lg shadow-[#0052FF]/20 mb-6">
        <span className="text-3xl">⚡</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
        What yield opportunity are you looking for on Base?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelect(`${prompt.icon} ${prompt.text}`)}
            className="flex items-center gap-3 p-4 bg-[#1a1f3c]/50 backdrop-blur-sm border border-white/5 hover:border-[#0052FF]/50 rounded-2xl text-left text-gray-200 hover:text-white hover:shadow-[0_0_15px_rgba(0,82,255,0.2)] hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">{prompt.icon}</span>
            <span className="font-medium text-sm sm:text-base">{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
