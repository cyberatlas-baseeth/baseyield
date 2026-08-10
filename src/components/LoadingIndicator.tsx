'use client';

import React from 'react';

export default function LoadingIndicator() {
  return (
    <div className="flex w-full justify-start animate-in fade-in duration-300">
      <div className="flex gap-3">
        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-white border border-[#e2e5f1] text-sm shadow-sm">
          ⚡
        </div>
        <div className="px-5 py-3.5 rounded-2xl bg-white border border-[#e2e5f1] shadow-sm rounded-tl-sm flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#0052FF] animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-[#0052FF] animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-[#0052FF] animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm text-gray-400 font-medium tracking-wide">Analyzing Base yields...</span>
        </div>
      </div>
    </div>
  );
}
