import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="bg-gradient-animated h-screen flex flex-col overflow-hidden">
      {/* Animated background gradient layer */}
      <div className="relative z-10 flex flex-col h-full">
        <Header />
        <main className="flex-1 overflow-hidden pt-[73px]">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}
