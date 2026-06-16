import { identifyCoin, Coin } from "./coinIdentifier";

const COIN_VALUES_CENTS: { [kind: string]: number } = {
  Nickel: 5,
  Dime: 10,
  Quarter: 25,
};

export class VendingMachine {
  private totalCents = 0;
  private rejectedCoins: Coin[] = [];

  display(): string {
    if (this.totalCents === 0) {
      return "INSERT COIN";
    }
    return (this.totalCents / 100).toFixed(2);
  }

  insertCoin(coin: Coin): void {
    const value = COIN_VALUES_CENTS[identifyCoin(coin)];
    if (value === undefined) {
      this.rejectedCoins.push(coin);
      return;
    }
    this.totalCents += value;
  }

  coinReturn(): Coin[] {
    return this.rejectedCoins;
  }
}
