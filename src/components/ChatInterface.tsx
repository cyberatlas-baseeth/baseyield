'use client';

import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ExamplePrompts from './ExamplePrompts';
import LoadingIndicator from './LoadingIndicator';
import PaymentMessage from './PaymentMessage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<{amount: string, currency: string, destination: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, paymentRequest]);

  const handleSendMessage = async (content: string, receipt?: string) => {
    if (!content.trim() || isLoading) return;

    const newUserMessage: Message = { id: Date.now().toString(), role: 'user', content };
    const currentMessages = [...messages, newUserMessage];
    setMessages(currentMessages);
    setIsLoading(true);

    try {
      const messagesForAPI = currentMessages.map(({ role, content }) => ({ role, content }));
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(receipt ? { 'x-402-payment-receipt': receipt } : {})
        },
        body: JSON.stringify({ messages: messagesForAPI }),
      });

      if (response.status === 402) {
        const errorData = await response.json();
        setPaymentRequest(errorData.paymentRequest);
        setIsLoading(false);
        return;
      }

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantContent = '';
      let buffer = '';
      
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);
      setIsLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // The last element is either an incomplete line or an empty string (if it ended with \n)
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (!line.trim()) continue;
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                assistantContent += (assistantContent ? '\n\n' : '') + `⚠️ **Error**: ${parsed.error}`;
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: assistantContent }
                      : msg
                  )
                );
              } else if (parsed.content) {
                assistantContent += parsed.content;
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: assistantContent }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
      
      if (!assistantContent.trim()) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: '⚠️ The response timed out or the model returned an empty response. Please try asking again.' }
              : msg
          )
        );
      }
    } catch (error) {
      setIsLoading(false);
      setMessages(prev => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: 'Sorry, I encountered an error while trying to fetch yield data. Please try again.' 
        }
      ]);
    }
  };

  const handlePaymentSuccess = (txHash: string) => {
    setPaymentRequest(null);
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (lastUserMessage) {
      // Remove the last message from state so handleSendMessage can re-add it without duplication
      setMessages(prev => prev.filter(m => m.id !== lastUserMessage.id));
      handleSendMessage(lastUserMessage.content, txHash);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scrollbar-thin scrollbar-thumb-[#e2e5f1] scrollbar-track-transparent">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="h-full min-h-[60vh] flex items-center">
              <ExamplePrompts onSelect={(content) => handleSendMessage(content)} />
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} role={message.role} content={message.content} />
              ))}
              {paymentRequest && (
                <PaymentMessage 
                  amount={paymentRequest.amount}
                  currency={paymentRequest.currency}
                  destination={paymentRequest.destination}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setPaymentRequest(null)}
                />
              )}
              {isLoading && <LoadingIndicator />}
              <div ref={messagesEndRef} className="h-1" />
            </>
          )}
        </div>
      </main>
      
      <div className="flex-shrink-0">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
