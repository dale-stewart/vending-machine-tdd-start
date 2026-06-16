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
- [ ] Display starts at `INSERT COIN`
- [ ] Inserting a valid coin updates running total / display
- [ ] Inserting a penny leaves display unchanged, routes coin to coin return

## Upcoming features
- [ ] Select Product (cola $1.00, chips $0.50, candy $0.65) — dispense + THANK YOU
- [ ] Make Change
- [ ] Return Coins (resets display to INSERT COIN)
- [ ] Sold Out
- [ ] Exact Change Only
