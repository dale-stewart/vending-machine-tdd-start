import { identifyCoin, Coin } from "./coinIdentifier";

const COIN_VALUES_CENTS: { [kind: string]: number } = {
  Nickel: 5,
  Dime: 10,
  Quarter: 25,
};

const PRODUCT_PRICES_CENTS: { [name: string]: number } = {
  cola: 100,
};

function formatCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

export class VendingMachine {
  private totalCents = 0;
  private rejectedCoins: Coin[] = [];
  private pendingMessage: string | null = null;

  display(): string {
    if (this.pendingMessage !== null) {
      return this.pendingMessage;
    }
    if (this.totalCents === 0) {
      return "INSERT COIN";
    }
    return formatCents(this.totalCents);
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

  selectProduct(product: string): void {
    const price = PRODUCT_PRICES_CENTS[product];
    if (this.totalCents < price) {
      this.pendingMessage = `PRICE ${formatCents(price)}`;
    }
  }
}
