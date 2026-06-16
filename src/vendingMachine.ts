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

const CHANGE_DENOMINATIONS: { cents: number; coin: Coin }[] = [...COIN_CATALOG]
  .sort((a, b) => b.valueCents - a.valueCents)
  .map((c) => ({ cents: c.valueCents, coin: { weight: c.weight, size: c.size } }));

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
    return this.changeBank.length > 0;
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
    this.coinReturnSlot.push(...makeChange(this.totalCents - price));
    this.inventory[product] = this.stockOf(product) - 1;
    this.clearInsertedFunds();
    this.pendingMessage = "THANK YOU";
  }

  private clearInsertedFunds(): void {
    this.totalCents = 0;
    this.insertedCoins = [];
  }
}
