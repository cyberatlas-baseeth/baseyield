// ============================================================
// YieldPulse — DefiLlama Yield Data Service
// ============================================================

import { DefiLlamaPool, DefiLlamaResponse, YieldPool } from "./types";
import { normalizePool } from "./utils";

const DEFILLAMA_POOLS_URL = "https://yields.llama.fi/pools";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** In-memory cache for yield data */
let cachedPools: YieldPool[] | null = null;
let cacheTimestamp = 0;

/**
 * Fetch all Base chain yield pools from DefiLlama.
 * Results are cached in-memory for 5 minutes.
 */
export async function getBaseYields(): Promise<YieldPool[]> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedPools && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedPools;
  }

  try {
    const response = await fetch(DEFILLAMA_POOLS_URL, {
      next: { revalidate: 300 }, // Next.js fetch cache: 5 min
    });

    if (!response.ok) {
      throw new Error(`DefiLlama API error: ${response.status}`);
    }

    const data: DefiLlamaResponse = await response.json();

    if (data.status !== "success" || !Array.isArray(data.data)) {
      throw new Error("Invalid DefiLlama response format");
    }

    // Filter to Base chain only, exclude zero/null APY and outliers
    const basePools = data.data
      .filter(
        (pool: DefiLlamaPool) =>
          pool.chain === "Base" &&
          pool.apy !== null &&
          pool.apy > 0 &&
          !pool.outlier &&
          pool.tvlUsd > 0
      )
      .map(normalizePool)
      .sort((a, b) => b.apy - a.apy);

    // Update cache
    cachedPools = basePools;
    cacheTimestamp = now;

    return basePools;
  } catch (error) {
    console.error("[DefiLlama] Failed to fetch yields:", error);

    // Return stale cache if available
    if (cachedPools) {
      console.warn("[DefiLlama] Returning stale cached data");
      return cachedPools;
    }

    throw error;
  }
}

/**
 * Get yield pools filtered by token symbol.
 */
export async function getYieldsByAsset(symbol: string): Promise<YieldPool[]> {
  const pools = await getBaseYields();
  const upperSymbol = symbol.toUpperCase();
  return pools.filter((p) => p.symbol.toUpperCase().includes(upperSymbol));
}

/**
 * Get top N yield pools by APY.
 */
export async function getTopYields(limit: number = 10): Promise<YieldPool[]> {
  const pools = await getBaseYields();
  return pools.slice(0, limit);
}

/**
 * Get yield pools filtered by risk level.
 */
export async function getYieldsByRisk(
  risk: "low" | "medium" | "high"
): Promise<YieldPool[]> {
  const pools = await getBaseYields();
  return pools.filter((p) => p.riskLevel === risk);
}

/**
 * Get only stablecoin yield pools.
 */
export async function getStablecoinYields(): Promise<YieldPool[]> {
  const pools = await getBaseYields();
  return pools.filter((p) => p.stablecoin);
}

/**
 * Format pools into a concise text summary for the LLM context.
 * This keeps the token count manageable while giving the agent
 * all the data it needs.
 */
export function formatPoolsForContext(pools: YieldPool[]): string {
  if (pools.length === 0) {
    return "No yield pools found on Base matching the criteria.";
  }

  const header =
    `Found ${pools.length} yield pools on Base (sorted by APY):\\n\\n` +
    `| # | Protocol | Asset | APY | TVL | Risk | Trend | Type |\\n` +
    `|---|----------|-------|-----|-----|------|-------|------|`;

  const rows = pools.slice(0, 50).map((pool, i) => {
    const trend = pool.apyChange7d
      ? pool.apyChange7d > 0
        ? "↑"
        : pool.apyChange7d < 0
          ? "↓"
          : "→"
      : "—";

    const type = pool.stablecoin ? "Stable" : "Volatile";
    const meta = pool.poolMeta ? ` (${pool.poolMeta})` : "";

    return `| ${i + 1} | ${pool.protocolDisplay} | ${pool.symbol}${meta} | ${pool.apy.toFixed(2)}% | $${formatCompactNumber(pool.tvlUsd)} | ${pool.riskLevel} | ${trend} | ${type} |`;
  });

  return header + "\\n" + rows.join("\\n");
}

/** Compact number format for context (saves tokens) */
function formatCompactNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
  return num.toFixed(0);
}
