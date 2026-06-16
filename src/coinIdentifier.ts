export function identifyCoin(coin: { weight: number; size: number }): string {
  if (coin.weight === 2.268 && coin.size === 17.91) {
    return "Dime";
  }
  if (coin.weight === 5.67 && coin.size === 24.26) {
    return "Quarter";
  }
  return "Nickel";
}
