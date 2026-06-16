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

  it("displays the price when cola is selected with insufficient funds", () => {
    const machine = new VendingMachine();
    machine.selectProduct("cola");
    expect(machine.display()).toEqual("PRICE 1.00");
  });

  it("reverts to INSERT COIN after the price has been displayed once", () => {
    const machine = new VendingMachine();
    machine.selectProduct("cola");
    expect([machine.display(), machine.display()]).toEqual([
      "PRICE 1.00",
      "INSERT COIN",
    ]);
  });

  it("displays THANK YOU when cola is selected with sufficient funds", () => {
    const machine = new VendingMachine();
    for (let i = 0; i < 4; i++) {
      machine.insertCoin({ weight: 5.67, size: 24.26 });
    }
    machine.selectProduct("cola");
    expect(machine.display()).toEqual("THANK YOU");
  });

  it("consumes the funds after a successful purchase", () => {
    const machine = new VendingMachine();
    for (let i = 0; i < 4; i++) {
      machine.insertCoin({ weight: 5.67, size: 24.26 });
    }
    machine.selectProduct("cola");
    expect([machine.display(), machine.display()]).toEqual([
      "THANK YOU",
      "INSERT COIN",
    ]);
  });

  it("displays the price when chips are selected with insufficient funds", () => {
    const machine = new VendingMachine();
    machine.selectProduct("chips");
    expect(machine.display()).toEqual("PRICE 0.50");
  });

  it("displays the price when candy is selected with insufficient funds", () => {
    const machine = new VendingMachine();
    machine.selectProduct("candy");
    expect(machine.display()).toEqual("PRICE 0.65");
  });

  it("returns the change to the coin return when overpaying", () => {
    const machine = new VendingMachine();
    for (let i = 0; i < 3; i++) {
      machine.insertCoin({ weight: 5.67, size: 24.26 });
    }
    machine.selectProduct("chips");
    expect(machine.coinReturn()).toEqual([{ weight: 5.67, size: 24.26 }]);
  });

  it("returns a dime as change when 0.10 is owed", () => {
    const machine = new VendingMachine();
    for (let i = 0; i < 3; i++) {
      machine.insertCoin({ weight: 5.67, size: 24.26 });
    }
    machine.selectProduct("candy");
    expect(machine.coinReturn()).toEqual([{ weight: 2.268, size: 17.91 }]);
  });

  it("returns a nickel as change when 0.05 is owed", () => {
    const machine = new VendingMachine();
    for (let i = 0; i < 4; i++) {
      machine.insertCoin({ weight: 5.67, size: 24.26 });
    }
    machine.insertCoin({ weight: 5.0, size: 21.21 });
    machine.selectProduct("cola");
    expect(machine.coinReturn()).toEqual([{ weight: 5.0, size: 21.21 }]);
  });

  it("returns the inserted coins when the customer presses return", () => {
    const machine = new VendingMachine();
    machine.insertCoin({ weight: 5.67, size: 24.26 });
    machine.returnCoins();
    expect(machine.coinReturn()).toEqual([{ weight: 5.67, size: 24.26 }]);
  });
});
