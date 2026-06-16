import { identifyCoin } from "./coinIdentifier";

const COIN_VALUES_CENTS: { [kind: string]: number } = {
  Nickel: 5,
  Dime: 10,
  Quarter: 25,
};

export class VendingMachine {
  private totalCents = 0;

  display(): string {
    if (this.totalCents === 0) {
      return "INSERT COIN";
    }
    return (this.totalCents / 100).toFixed(2);
  }

  insertCoin(coin: { weight: number; size: number }): void {
    this.totalCents += COIN_VALUES_CENTS[identifyCoin(coin)] ?? 0;
  }
}
