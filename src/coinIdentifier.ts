export function identifyCoin(coin: { weight: number; size: number }): string {
  if (coin.weight === 2.268 && coin.size === 17.91) {
    return "Dime";
  }
  return "Nickel";
}
