import { identifyCoin } from "./coinIdentifier";

describe("identifyCoin", () => {
  it.each([
    ["a nickel", { weight: 5.0, size: 21.21 }, "Nickel"],
    ["a dime", { weight: 2.268, size: 17.91 }, "Dime"],
    ["a quarter", { weight: 5.67, size: 24.26 }, "Quarter"],
    ["an unrecognized penny", { weight: 2.5, size: 19.05 }, "Unknown"],
    ["a slug matching only a quarter's weight", { weight: 5.67, size: 99 }, "Unknown"],
    ["a slug matching only a quarter's size", { weight: 99, size: 24.26 }, "Unknown"],
  ])("identifies %s by weight and size", (_label, coin, expected) => {
    expect(identifyCoin(coin)).toEqual(expected);
  });
});
