export class VendingMachine {
  private totalCents = 0;

  display(): string {
    if (this.totalCents === 0) {
      return "INSERT COIN";
    }
    return (this.totalCents / 100).toFixed(2);
  }

  insertCoin(coin: { weight: number; size: number }): void {
    this.totalCents += 5;
  }
}
