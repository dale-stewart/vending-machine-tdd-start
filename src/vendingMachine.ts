import { identifyCoin, Coin, COIN_CATALOG } from "./coinIdentifier";

const COIN_VALUES_CENTS: { [kind: string]: number } = Object.fromEntries(
  COIN_CATALOG.map((c) => [c.kind, c.valueCents]),
);

const PRODUCT_PRICES_CENTS: { [name: string]: number } = {
  cola: 100,
  chips: 50,
  candy: 65,
};

function formatCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

const DEFAULT_STOCK = 1;

const DEFAULT_CHANGE_BANK: Coin[] = COIN_CATALOG.flatMap((c) =>
  Array(5).fill({ weight: c.weight, size: c.size }),
);

export class VendingMachine {
  private totalCents = 0;
  private insertedCoins: Coin[] = [];
  private coinReturnSlot: Coin[] = [];
  private pendingMessage: string | null = null;

  constructor(
    private inventory: { [name: string]: number } = {},
    private changeBank: Coin[] = DEFAULT_CHANGE_BANK,
  ) {}

  private stockOf(product: string): number {
    return this.inventory[product] ?? DEFAULT_STOCK;
  }

  private canMakeChange(): boolean {
    return this.drawChange(5) !== null;
  }

  private drawChange(amount: number): Coin[] | null {
    const sorted = [...this.changeBank].sort(
      (a, b) => this.coinValue(b) - this.coinValue(a),
    );
    const used: Coin[] = [];
    let remaining = amount;
    for (const coin of sorted) {
      const value = this.coinValue(coin);
      if (value <= remaining) {
        used.push(coin);
        remaining -= value;
      }
    }
    return remaining === 0 ? used : null;
  }

  private coinValue(coin: Coin): number {
    return COIN_VALUES_CENTS[identifyCoin(coin)] ?? 0;
  }

  display(): string {
    if (this.pendingMessage !== null) {
      const message = this.pendingMessage;
      this.pendingMessage = null;
      return message;
    }
    if (this.totalCents === 0) {
      return this.canMakeChange() ? "INSERT COIN" : "EXACT CHANGE ONLY";
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
    this.insertedCoins.push(coin);
  }

  coinReturn(): Coin[] {
    return this.coinReturnSlot;
  }

  returnCoins(): void {
    this.coinReturnSlot.push(...this.insertedCoins);
    this.clearInsertedFunds();
  }

  selectProduct(product: string): void {
    if (this.stockOf(product) === 0) {
      this.pendingMessage = "SOLD OUT";
      return;
    }
    const price = PRODUCT_PRICES_CENTS[product];
    if (this.totalCents < price) {
      this.pendingMessage = `PRICE ${formatCents(price)}`;
      return;
    }
    const change = this.drawChange(this.totalCents - price) ?? [];
    for (const coin of change) {
      const index = this.changeBank.findIndex(
        (c) => c.weight === coin.weight && c.size === coin.size,
      );
      this.changeBank.splice(index, 1);
    }
    this.coinReturnSlot.push(...change);
    this.inventory[product] = this.stockOf(product) - 1;
    this.clearInsertedFunds();
    this.pendingMessage = "THANK YOU";
  }

  private clearInsertedFunds(): void {
    this.totalCents = 0;
    this.insertedCoins = [];
  }
}
