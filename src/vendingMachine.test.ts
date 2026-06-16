import { VendingMachine } from "./vendingMachine";

describe("VendingMachine", () => {
  it("displays INSERT COIN when no money has been inserted", () => {
    const machine = new VendingMachine();
    expect(machine.display()).toEqual("INSERT COIN");
  });

  it("displays 0.05 after inserting a nickel", () => {
    const machine = new VendingMachine();
    machine.insertCoin({ weight: 5.0, size: 21.21 });
    expect(machine.display()).toEqual("0.05");
  });

  it("displays 0.10 after inserting a dime", () => {
    const machine = new VendingMachine();
    machine.insertCoin({ weight: 2.268, size: 17.91 });
    expect(machine.display()).toEqual("0.10");
  });

  it("accumulates the total across multiple coins", () => {
    const machine = new VendingMachine();
    machine.insertCoin({ weight: 5.0, size: 21.21 });
    machine.insertCoin({ weight: 2.268, size: 17.91 });
    expect(machine.display()).toEqual("0.15");
  });

  it("routes a rejected penny to the coin return", () => {
    const machine = new VendingMachine();
    machine.insertCoin({ weight: 2.5, size: 19.05 });
    expect(machine.coinReturn()).toEqual([{ weight: 2.5, size: 19.05 }]);
  });
});
