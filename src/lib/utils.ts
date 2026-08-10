// ============================================================
// YieldPulse — Utility Functions
// ============================================================

import { DefiLlamaPool, YieldPool } from "./types";

/**
 * Format USD amount into human-readable string.
 * e.g., 1234567 → "$1.23M", 456789 → "$456.79K"
 */
export function formatTVL(tvl: number): string {
  if (tvl >= 1_000_000_000) {
    return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  }
  if (tvl >= 1_000_000) {
    return `$${(tvl / 1_000_000).toFixed(2)}M`;
  }
  if (tvl >= 1_000) {
    return `$${(tvl / 1_000).toFixed(2)}K`;
  }
  return `$${tvl.toFixed(2)}`;
}

/**
 * Format APY as percentage string.
 * e.g., 4.52528 → "4.53%"
 */
export function formatAPY(apy: number | null): string {
  if (apy === null || apy === undefined) return "N/A";
  return `${apy.toFixed(2)}%`;
}

/**
 * Compute a simple risk level based on pool characteristics.
 * - Low: stablecoin, single exposure, no IL risk, TVL > $10M
 * - Medium: single exposure, TVL > $1M
 * - High: everything else (multi exposure, IL risk, low TVL)
 */
export function computeRiskLevel(
  pool: DefiLlamaPool
): "low" | "medium" | "high" {
  const isStable = pool.stablecoin;
  const isSingleExposure = pool.exposure === "single";
  const noIL = pool.ilRisk === "no";
  const highTVL = pool.tvlUsd > 10_000_000;
  const mediumTVL = pool.tvlUsd > 1_000_000;

  // Very high APY is suspicious (potential rug / unsustainable)
  const suspiciousAPY = pool.apy > 100;

  if (suspiciousAPY) return "high";

  if (isStable && isSingleExposure && noIL && highTVL) {
    return "low";
  }

  if (isSingleExposure && noIL && mediumTVL) {
    return "medium";
  }

  return "high";
}

/**
 * Map DefiLlama project slugs to human-readable display names.
 */
const PROTOCOL_DISPLAY_NAMES: Record<string, string> = {
  "morpho-blue": "Morpho Blue",
  "aave-v3": "Aave V3",
  "compound-v3": "Compound V3",
  "moonwell-v2": "Moonwell",
  "extra-finance": "Extra Finance",
  "aerodrome-v2": "Aerodrome",
  "aerodrome-v1": "Aerodrome",
  "seamless-protocol": "Seamless",
  "stargate-v2": "Stargate V2",
  "beefy": "Beefy",
  "yearn-v3": "Yearn V3",
  "sonne-finance": "Sonne Finance",
  "overnight-usd+": "Overnight USD+",
  "uniswap-v3": "Uniswap V3",
  "baseswap-v3": "BaseSwap V3",
  "sky-lending": "Sky Lending",
  "spark-savings": "Spark",
  "fluid-lending": "Fluid",
  "euler-v2": "Euler V2",
  "moonwell": "Moonwell",
  "ionic-protocol": "Ionic",
  "radiant-v2": "Radiant V2",
  "exactly": "Exactly",
};

/**
 * Get display name for a protocol. Falls back to title-casing the slug.
 */
export function getProtocolDisplay(slug: string): string {
  if (PROTOCOL_DISPLAY_NAMES[slug]) {
    return PROTOCOL_DISPLAY_NAMES[slug];
  }
  // Fallback: title-case the slug
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Map known protocols to their app URLs for linking.
 */
const PROTOCOL_URLS: Record<string, string> = {
  "morpho-blue": "https://app.morpho.org/?network=base",
  "aave-v3": "https://app.aave.com/?marketName=proto_base_v3",
  "compound-v3": "https://app.compound.finance/",
  "moonwell-v2": "https://moonwell.fi/discover",
  "aerodrome-v2": "https://aerodrome.finance/",
  "aerodrome-v1": "https://aerodrome.finance/",
  "seamless-protocol": "https://app.seamlessprotocol.com/",
  "stargate-v2": "https://stargate.finance/",
  "extra-finance": "https://app.extrafi.io/",
  "uniswap-v3": "https://app.uniswap.org/",
  "fluid-lending": "https://fluid.instadapp.io/",
  "euler-v2": "https://app.euler.finance/",
  "moonwell": "https://moonwell.fi/discover",
  "ionic-protocol": "https://app.ionic.money/",
};

/**
 * Get the app URL for a protocol. Returns null if unknown.
 */
export function getProtocolUrl(slug: string): string | null {
  return PROTOCOL_URLS[slug] || null;
}

/**
 * Convert a raw DefiLlama pool into our normalized YieldPool type.
 */
export function normalizePool(raw: DefiLlamaPool): YieldPool {
  return {
    id: raw.pool,
    protocol: raw.project,
    protocolDisplay: getProtocolDisplay(raw.project),
    symbol: raw.symbol,
    apy: raw.apy ?? 0,
    apyBase: raw.apyBase,
    apyReward: raw.apyReward,
    tvlUsd: raw.tvlUsd,
    stablecoin: raw.stablecoin,
    riskLevel: computeRiskLevel(raw),
    ilRisk: raw.ilRisk,
    exposure: raw.exposure,
    poolMeta: raw.poolMeta,
    apyChange1d: raw.apyPct1D,
    apyChange7d: raw.apyPct7D,
    apyChange30d: raw.apyPct30D,
    apyMean30d: raw.apyMean30d,
    predictedClass: raw.predictions?.predictedClass ?? null,
    rewardTokens: raw.rewardTokens,
    underlyingTokens: raw.underlyingTokens,
  };
}

/**
 * Generate a unique ID for messages.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Risk level badge emoji
 */
export function getRiskEmoji(risk: "low" | "medium" | "high"): string {
  switch (risk) {
    case "low":
      return "🟢";
    case "medium":
      return "🟡";
    case "high":
      return "🔴";
  }
}
