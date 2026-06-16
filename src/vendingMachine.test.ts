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
});
