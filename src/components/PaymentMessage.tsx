'use client';

import React, { useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseUnits } from 'viem';

interface PaymentMessageProps {
  amount: string;
  currency: string;
  destination: string;
  onSuccess: (txHash: string) => void;
  onCancel: () => void;
}

// USDC on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default function PaymentMessage({ amount, currency, destination, onSuccess, onCancel }: PaymentMessageProps) {
  const { isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess && hash) {
      onSuccess(hash);
    }
  }, [isSuccess, hash, onSuccess]);

  const handlePay = () => {
    if (!isConnected) {
      alert('Please connect your wallet first using the button in the header.');
      return;
    }
    
    // USDC has 6 decimals
    const value = parseUnits(amount, 6);
    
    writeContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [destination as `0x${string}`, value],
    });
  };

  return (
    <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-300 my-2">
      <div className="flex max-w-[85%] sm:max-w-[75%] gap-3 flex-row">
        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-sm shadow-sm bg-white border border-[#e2e5f1]">
          🔒
        </div>
        
        <div className="px-5 py-4 rounded-2xl bg-white text-[#4b5563] border border-[#e2e5f1] rounded-tl-sm shadow-sm flex flex-col gap-3 min-w-[250px]">
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">Premium Feature</h3>
            <p className="text-[14px]">Detailed Risk Analysis requires a one-time payment.</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex justify-between items-center">
            <span className="text-blue-800 font-medium text-sm">Amount due</span>
            <span className="font-bold text-blue-900">{amount} {currency}</span>
          </div>

          {error && (
            <p className="text-red-500 text-xs break-words max-w-[250px]">Error: {error.message.split('\n')[0]}</p>
          )}

          <div className="flex gap-2 mt-1">
            <button
              onClick={handlePay}
              disabled={isPending || isConfirming}
              className="flex-1 bg-[#0052FF] hover:bg-[#0052FF]/90 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-colors disabled:opacity-50 flex justify-center items-center"
            >
              {isPending ? 'Confirming...' : isConfirming ? 'Waiting...' : 'Pay with Wallet'}
            </button>
            <button
              onClick={onCancel}
              disabled={isPending || isConfirming}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
