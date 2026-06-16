type Coin = { weight: number; size: number };
type CoinKind = "Nickel" | "Dime" | "Quarter" | "Unknown";

const COIN_SPECS: (Coin & { kind: CoinKind })[] = [
  { weight: 5.0, size: 21.21, kind: "Nickel" },
  { weight: 2.268, size: 17.91, kind: "Dime" },
  { weight: 5.67, size: 24.26, kind: "Quarter" },
];

export function identifyCoin(coin: Coin): CoinKind {
  const match = COIN_SPECS.find(
    (spec) => spec.weight === coin.weight && spec.size === coin.size,
  );
  return match ? match.kind : "Unknown";
}
