import { identifyCoin } from "./coinIdentifier";

describe("identifyCoin", () => {
  it("identifies a 5.000g, 21.21mm coin as a nickel", () => {
    expect(identifyCoin({ weight: 5.0, size: 21.21 })).toEqual("Nickel");
  });
});
