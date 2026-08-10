import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="bg-pixel-grid h-screen flex flex-col overflow-hidden relative">
      {/* Decorative Isometric Blocks */}
      <div className="iso-block iso-block-blue float-slow top-[10%] left-[5%]"></div>
      <div className="iso-block iso-block-purple float-medium float-delay-1 top-[60%] left-[8%]"></div>
      <div className="iso-block iso-block-green float-slow float-delay-2 top-[20%] right-[7%]"></div>
      <div className="iso-block iso-block-cream float-medium float-delay-3 top-[75%] right-[10%]"></div>
      <div className="pixel-dots"></div>

      <div className="relative z-10 flex flex-col h-full">
        <Header />
        <main className="flex-1 overflow-hidden pt-[73px]">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}
