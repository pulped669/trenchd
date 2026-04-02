// Simple linear bonding curve similar to pump.fun
// Price increases linearly as supply is purchased
// Graduates to DEX (e.g., Raydium) at a threshold

const INITIAL_PRICE = 0.00000001; // SOL per token
const SLOPE = 0.0000000001; // Price increase per token sold
const TOTAL_SUPPLY = 1_000_000_000; // 1B tokens
const GRADUATION_THRESHOLD = 800_000_000; // Graduate at 80% sold
const GRADUATION_MARKET_CAP = 69; // ~69 SOL market cap to graduate

export function getPrice(sold: number): number {
  return INITIAL_PRICE + SLOPE * sold;
}

export function getMarketCap(sold: number): number {
  const currentPrice = getPrice(sold);
  return currentPrice * TOTAL_SUPPLY;
}

export function getBuyPrice(sold: number, amount: number): number {
  // Integral of linear curve: cost = INITIAL_PRICE * amount + SLOPE * (sold * amount + amount^2 / 2)
  const cost =
    INITIAL_PRICE * amount +
    SLOPE * (sold * amount + (amount * amount) / 2);
  return cost;
}

export function getSellPrice(sold: number, amount: number): number {
  const newSold = sold - amount;
  if (newSold < 0) return 0;
  const revenue =
    INITIAL_PRICE * amount +
    SLOPE * (newSold * amount + (amount * amount) / 2);
  return revenue;
}

export function shouldGraduate(sold: number): boolean {
  return sold >= GRADUATION_THRESHOLD;
}

export function getProgress(sold: number): number {
  return Math.min((sold / GRADUATION_THRESHOLD) * 100, 100);
}

export { TOTAL_SUPPLY, GRADUATION_THRESHOLD, GRADUATION_MARKET_CAP };
