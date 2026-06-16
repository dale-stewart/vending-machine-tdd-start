import { identifyCoin, Coin } from "./coinIdentifier";

const COIN_VALUES_CENTS: { [kind: string]: number } = {
  Nickel: 5,
  Dime: 10,
  Quarter: 25,
};

const PRODUCT_PRICES_CENTS: { [name: string]: number } = {
  cola: 100,
  chips: 50,
  candy: 65,
};

function formatCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

const CHANGE_DENOMINATIONS: { cents: number; coin: Coin }[] = [
  { cents: 25, coin: { weight: 5.67, size: 24.26 } },
  { cents: 10, coin: { weight: 2.268, size: 17.91 } },
  { cents: 5, coin: { weight: 5.0, size: 21.21 } },
];

function makeChange(cents: number): Coin[] {
  const coins: Coin[] = [];
  let remaining = cents;
  for (const { cents: denom, coin } of CHANGE_DENOMINATIONS) {
    while (remaining >= denom) {
      coins.push(coin);
      remaining -= denom;
    }
  }
  return coins;
}

export class VendingMachine {
  private totalCents = 0;
  private coinReturnSlot: Coin[] = [];
  private pendingMessage: string | null = null;

  display(): string {
    if (this.pendingMessage !== null) {
      const message = this.pendingMessage;
      this.pendingMessage = null;
      return message;
    }
    if (this.totalCents === 0) {
      return "INSERT COIN";
    }
    return formatCents(this.totalCents);
  }

  insertCoin(coin: Coin): void {
    const value = COIN_VALUES_CENTS[identifyCoin(coin)];
    if (value === undefined) {
      this.coinReturnSlot.push(coin);
      return;
    }
    this.totalCents += value;
  }

  coinReturn(): Coin[] {
    return this.coinReturnSlot;
  }

  selectProduct(product: string): void {
    const price = PRODUCT_PRICES_CENTS[product];
    if (this.totalCents < price) {
      this.pendingMessage = `PRICE ${formatCents(price)}`;
      return;
    }
    this.coinReturnSlot.push(...makeChange(this.totalCents - price));
    this.totalCents = 0;
    this.pendingMessage = "THANK YOU";
  }
}
