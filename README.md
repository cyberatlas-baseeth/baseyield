# YieldPulse

AI-powered yield discovery agent for the **Base** blockchain. Find the best DeFi yields, compare protocols, and discover high-APY opportunities — all through natural language.

![Base](https://img.shields.io/badge/Base-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## Features

- 🤖 **AI-Powered Chat** — Ask natural language questions about Base yields
- 📊 **Live Data** — Real-time yield data from DefiLlama (updated every 5 minutes)
- 🛡️ **Risk Assessment** — Automatic risk scoring (Low/Medium/High)
- 🔗 **Base Native** — Exclusively focused on Base blockchain opportunities
- 👛 **Wallet Connect** — OnchainKit-powered wallet integration
- ⚡ **Fast** — Groq LLM inference for near-instant responses

## Example Questions

- "What's the best USDC yield on Base right now?"
- "Show me the top 5 opportunities"
- "Safe high APY options"
- "Compare yields for USDC"

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Wallet**: OnchainKit (Coinbase)
- **LLM**: Groq (Llama 3.1 8B Instant)
- **Data**: DefiLlama Yields API (filtered for Base)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/cyberatlas-baseeth/baseyield.git
   cd baseyield
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` from the template:
   ```bash
   cp .env.example .env.local
   ```

4. Add your API keys to `.env.local`:
   - **GROQ_API_KEY**: Get free at [console.groq.com](https://console.groq.com/keys)
   - **NEXT_PUBLIC_ONCHAINKIT_API_KEY**: Get free at [CDP Portal](https://portal.cdp.coinbase.com/products/onchainkit)

5. Run the dev server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cyberatlas-baseeth/baseyield)

Make sure to add the environment variables in Vercel dashboard.

## License

MIT
