export type Coin = { weight: number; size: number };
export type CoinKind = "Nickel" | "Dime" | "Quarter" | "Unknown";

export const COIN_CATALOG: {
  kind: Exclude<CoinKind, "Unknown">;
  valueCents: number;
  weight: number;
  size: number;
}[] = [
  { kind: "Nickel", valueCents: 5, weight: 5.0, size: 21.21 },
  { kind: "Dime", valueCents: 10, weight: 2.268, size: 17.91 },
  { kind: "Quarter", valueCents: 25, weight: 5.67, size: 24.26 },
];

export function identifyCoin(coin: Coin): CoinKind {
  const match = COIN_CATALOG.find(
    (spec) => spec.weight === coin.weight && spec.size === coin.size,
  );
  return match ? match.kind : "Unknown";
}
