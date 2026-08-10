'use client';

import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/80 border-b border-[#e2e5f1]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0052FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0052FF]"></span>
          </div>
          <span className="text-xl font-bold pixel-text">YieldPulse</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#0052FF]/20 text-[#0052FF] text-xs font-semibold border border-[#0052FF]/30">
          Base
        </span>
      </div>
      <div>
        <ConnectWallet className="!bg-[#0052FF] hover:!bg-[#0052FF]/90 text-white rounded-xl font-semibold" />
      </div>
    </header>
  );
}
