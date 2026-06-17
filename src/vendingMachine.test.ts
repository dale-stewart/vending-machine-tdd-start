import { VendingMachine } from "./vendingMachine";

const NICKEL = { weight: 5.0, size: 21.21 };
const DIME = { weight: 2.268, size: 17.91 };
const QUARTER = { weight: 5.67, size: 24.26 };
const PENNY = { weight: 2.5, size: 19.05 };

function insertCoins(
  machine: VendingMachine,
  coins: { weight: number; size: number }[],
): void {
  coins.forEach((coin) => machine.insertCoin(coin));
}

describe("VendingMachine", () => {
  it("displays INSERT COIN when no money has been inserted", () => {
    expect(new VendingMachine().display()).toEqual("INSERT COIN");
  });

  it.each([
    ["a nickel", [NICKEL], "0.05"],
    ["a dime", [DIME], "0.10"],
    ["a nickel and a dime", [NICKEL, DIME], "0.15"],
  ])("shows the running total after inserting %s", (_label, coins, expected) => {
    const machine = new VendingMachine();
    insertCoins(machine, coins);
    expect(machine.display()).toEqual(expected);
  });

  it("routes a rejected penny to the coin return", () => {
    const machine = new VendingMachine();
    machine.insertCoin(PENNY);
    expect(machine.coinReturn()).toEqual([PENNY]);
  });

  it.each([
    ["cola", "PRICE 1.00"],
    ["chips", "PRICE 0.50"],
    ["candy", "PRICE 0.65"],
  ])(
    "displays the price when %s is selected with insufficient funds",
    (product, expected) => {
      const machine = new VendingMachine();
      machine.selectProduct(product);
      expect(machine.display()).toEqual(expected);
    },
  );

  it("reverts to INSERT COIN after the price has been displayed once", () => {
    const machine = new VendingMachine();
    machine.selectProduct("cola");
    expect([machine.display(), machine.display()]).toEqual([
      "PRICE 1.00",
      "INSERT COIN",
    ]);
  });

  it("dispenses on sufficient funds, showing THANK YOU then consuming the funds", () => {
    const machine = new VendingMachine();
    insertCoins(machine, [QUARTER, QUARTER, QUARTER, QUARTER]);
    machine.selectProduct("cola");
    expect([machine.display(), machine.display()]).toEqual([
      "THANK YOU",
      "INSERT COIN",
    ]);
  });

  it.each([
    ["a quarter", [QUARTER, QUARTER, QUARTER], "chips", [QUARTER]],
    ["a dime", [QUARTER, QUARTER, QUARTER], "candy", [DIME]],
    ["a nickel", [QUARTER, QUARTER, QUARTER, QUARTER, NICKEL], "cola", [NICKEL]],
  ])(
    "returns %s as change to the coin return when overpaying",
    (_label, coins, product, expectedChange) => {
      const machine = new VendingMachine();
      insertCoins(machine, coins);
      machine.selectProduct(product);
      expect(machine.coinReturn()).toEqual(expectedChange);
    },
  );

  it("returns the inserted coins when the customer presses return", () => {
    const machine = new VendingMachine();
    machine.insertCoin(QUARTER);
    machine.returnCoins();
    expect(machine.coinReturn()).toEqual([QUARTER]);
  });

  it("resets the display to INSERT COIN after returning coins", () => {
    const machine = new VendingMachine();
    machine.insertCoin(QUARTER);
    machine.returnCoins();
    expect(machine.display()).toEqual("INSERT COIN");
  });

  it("does not return coins that were consumed by a purchase", () => {
    const machine = new VendingMachine();
    insertCoins(machine, [QUARTER, QUARTER, QUARTER, QUARTER]);
    machine.selectProduct("cola");
    machine.returnCoins();
    expect(machine.coinReturn()).toEqual([]);
  });

  it("displays SOLD OUT when the selected product is out of stock", () => {
    const machine = new VendingMachine({ cola: 0 });
    insertCoins(machine, [QUARTER, QUARTER, QUARTER, QUARTER]);
    machine.selectProduct("cola");
    expect(machine.display()).toEqual("SOLD OUT");
  });

  it("becomes sold out after the last item is purchased", () => {
    const machine = new VendingMachine({ cola: 1 });
    insertCoins(machine, Array(8).fill(QUARTER));
    machine.selectProduct("cola");
    machine.selectProduct("cola");
    expect(machine.display()).toEqual("SOLD OUT");
  });

  it.each([
    ["the bank is empty", []],
    ["the bank holds only a dime (cannot make 5)", [DIME]],
  ])("displays EXACT CHANGE ONLY at rest when %s", (_label, bank) => {
    const machine = new VendingMachine({}, bank);
    expect(machine.display()).toEqual("EXACT CHANGE ONLY");
  });

  it("draws change from the bank, depleting it into the exact-change state", () => {
    const machine = new VendingMachine({}, [NICKEL]);
    insertCoins(machine, [QUARTER, DIME, DIME, DIME]);
    machine.selectProduct("chips");
    expect([machine.display(), machine.display()]).toEqual([
      "THANK YOU",
      "EXACT CHANGE ONLY",
    ]);
  });

  it("refuses the sale when the bank cannot make the required change", () => {
    const machine = new VendingMachine({}, [NICKEL]);
    insertCoins(machine, [QUARTER, QUARTER, QUARTER]);
    machine.selectProduct("chips");
    machine.returnCoins();
    expect(machine.coinReturn()).toEqual([QUARTER, QUARTER, QUARTER]);
  });

  it("ignores selection of an unknown product, retaining funds", () => {
    const machine = new VendingMachine();
    insertCoins(machine, [QUARTER]);
    machine.selectProduct("water");
    machine.returnCoins();
    expect(machine.coinReturn()).toEqual([QUARTER]);
  });

  it("replenishes the change bank with inserted coins on a completed sale", () => {
    const machine = new VendingMachine({}, []);
    insertCoins(machine, Array(10).fill(NICKEL));
    machine.selectProduct("chips");
    expect([machine.display(), machine.display()]).toEqual([
      "THANK YOU",
      "INSERT COIN",
    ]);
  });

  it("removes the specific change coin from the bank, not another", () => {
    // Bank holds the nickel between a dime and a quarter; paying without a
    // nickel means only removing THAT nickel leaves the bank unable to make 5.
    const machine = new VendingMachine({}, [DIME, NICKEL, QUARTER]);
    insertCoins(machine, [QUARTER, DIME, DIME, DIME]);
    machine.selectProduct("chips");
    expect([machine.display(), machine.display()]).toEqual([
      "THANK YOU",
      "EXACT CHANGE ONLY",
    ]);
  });
});
