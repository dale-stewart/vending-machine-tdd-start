# Progress

## Feature 1: Accept Coins
Valid coins (nickel, dime, quarter) update the display; invalid ones (penny) go to coin return.
Design note: coins don't know their own value — identified by weight/size.

### Coin identification (`src/coinIdentifier.ts`)
- [x] Identify nickel by weight (5.000g) and size (21.21mm)
- [x] Identify dime by weight (2.268g) and size (17.91mm)
- [x] Identify quarter by weight (5.670g) and size (24.26mm)
- [x] Identify penny (2.500g, 19.05mm) as invalid / unknown

### Remaining feature 1 parts
- [x] Display starts at `INSERT COIN`
- [x] Inserting a valid coin updates running total / display (nickel, dime)
- [x] Total accumulates across multiple coins (characterization test)
- [x] Inserting a penny leaves display unchanged, routes coin to coin return

## Feature 2: Select Product (cola $1.00, chips $0.50, candy $0.65)
- [x] Select with insufficient funds shows PRICE x.xx (cola)
- [x] PRICE/THANK YOU message reverts to INSERT COIN/amount after one display read
- [x] Select with sufficient funds dispenses + shows THANK YOU, resets total
- [x] Chips ($0.50) and candy ($0.65) prices

Known gap (untested, out of stated scope): selecting an unknown product
falls through to the dispense branch (0 < undefined === false).

## Feature 3: Make Change
- [x] Overpayment returns change to coin return
- [x] Multi-denomination change (quarter, dime, nickel via greedy)
- [x] Refactor: single COIN_CATALOG source of truth across modules

## Feature 4: Return Coins
- [x] returnCoins() puts inserted coins into the coin return
- [x] returnCoins() resets display to INSERT COIN
- [x] Purchase consumes inserted coins (can't be returned afterward)

## Upcoming features
- [ ] Sold Out
- [ ] Exact Change Only
