// ============================================================
// YieldPulse — Core Type Definitions
// ============================================================

/** Normalized yield pool data used throughout the app */
export interface YieldPool {
  /** DefiLlama pool UUID */
  id: string;
  /** Protocol name (e.g., "morpho-blue", "aave-v3") */
  protocol: string;
  /** Display-friendly protocol name */
  protocolDisplay: string;
  /** Token symbol (e.g., "USDC", "WETH") */
  symbol: string;
  /** Total APY (base + reward) */
  apy: number;
  /** Base APY (organic yield) */
  apyBase: number | null;
  /** Reward APY (token incentives) */
  apyReward: number | null;
  /** Total Value Locked in USD */
  tvlUsd: number;
  /** Whether it's a stablecoin pool */
  stablecoin: boolean;
  /** Risk level computed from heuristics */
  riskLevel: "low" | "medium" | "high";
  /** Impermanent Loss risk */
  ilRisk: string;
  /** Exposure type: single or multi asset */
  exposure: string;
  /** Optional pool metadata */
  poolMeta: string | null;
  /** 1-day APY change */
  apyChange1d: number | null;
  /** 7-day APY change */
  apyChange7d: number | null;
  /** 30-day APY change */
  apyChange30d: number | null;
  /** 30-day mean APY for stability assessment */
  apyMean30d: number | null;
  /** Prediction class from DefiLlama */
  predictedClass: string | null;
  /** Reward tokens if any */
  rewardTokens: string[] | null;
  /** Underlying token addresses */
  underlyingTokens: string[] | null;
}

/** Raw pool data from DefiLlama yields API */
export interface DefiLlamaPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase: number | null;
  apyReward: number | null;
  apy: number;
  rewardTokens: string[] | null;
  pool: string;
  apyPct1D: number | null;
  apyPct7D: number | null;
  apyPct30D: number | null;
  stablecoin: boolean;
  ilRisk: string;
  exposure: string;
  predictions: {
    predictedClass: string | null;
    predictedProbability: number | null;
    binnedConfidence: number | null;
  };
  poolMeta: string | null;
  mu: number;
  sigma: number;
  count: number;
  outlier: boolean;
  underlyingTokens: string[] | null;
  apyBase7d: number | null;
  apyMean30d: number | null;
  volumeUsd1d: number | null;
  volumeUsd7d: number | null;
}

/** DefiLlama API response wrapper */
export interface DefiLlamaResponse {
  status: string;
  data: DefiLlamaPool[];
}

/** Chat message structure */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

/** Chat API request body */
export interface ChatRequest {
  messages: Pick<ChatMessage, "role" | "content">[];
}

/** Streamed chat response chunk */
export interface ChatStreamChunk {
  content?: string;
  error?: string;
  done?: boolean;
}
