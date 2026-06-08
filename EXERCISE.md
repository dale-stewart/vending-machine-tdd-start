Core features to implement (in order):

Accept Coins — valid coins (nickel, dime, quarter) update the display; invalid ones (penny) go to coin return
Select Product — cola ($1.00), chips ($0.50), candy ($0.65); dispense on sufficient funds, show THANK YOU
Make Change — return remainder to coin return
Return Coins — customer-initiated return, display resets to INSERT COIN
Sold Out — display SOLD OUT if item is out of stock
Exact Change Only — display EXACT CHANGE ONLY when machine can't make change

One notable design note: coins shouldn't know their own value — a real machine identifies coins by weight/size.

Sources:

guyroyse/vending-machine-kata

work in typescript and use jest for testing
