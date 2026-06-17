# Code Reviews

Record of the `/nw-review` passes run against this kata. Each review was
dispatched to the `nw-software-crafter-reviewer` agent (Haiku, read-only) with
`workflow_mode=classic`. The prompts below are the full briefs sent to the
reviewer.

| # | Trigger | Verdict |
|---|---------|---------|
| 1 | Initial review | NEEDS_REVISION — one blocker (D1: test budget 26 > 16) |
| 2 | Confirm blocker resolved | APPROVED — zero defects |
| 3 | Confirm replenishment stays clean | APPROVED — zero defects |

---

## Review 1 — initial review

```
Review implementation: the vending machine TDD kata source at /home/dale/Projects/LiminalArc/vending-machine-tdd-start/src/

workflow_mode=classic

Artifacts to review (read all):
- src/coinIdentifier.ts
- src/vendingMachine.ts
- src/coinIdentifier.test.ts
- src/vendingMachine.test.ts
- EXERCISE.md (the requirements)
- PROGRESS.md (status + known gaps)

Context: This is a TypeScript + Jest vending machine kata built strictly via TDD (red/green/refactor, one failing test at a time). 26 tests pass. All six EXERCISE.md features are implemented: Accept Coins, Select Product, Make Change, Return Coins, Sold Out, Exact Change Only. Coins are identified by physical weight/size (value lives in the machine, not the coin). The change bank is constructor-injected and depletes through use.

Apply RPP code-smell dimensions L1-L6. Focus on:
1. Correctness vs. EXERCISE.md requirements, including the known deferred gaps in PROGRESS.md (insufficient-bank purchase guard where drawChange can return null -> `?? []`; unknown-product selectProduct fall-through; bank not replenished from inserts by design).
2. Test quality and TDD discipline (one assertion per test, deep equality, characterization tests are labeled).
3. Design/readability, duplication, naming, RPP smells.
4. Any real bugs (e.g. greedy drawChange optimality, edge cases).

Use Radical Candor + Conventional Comments. Priority-order findings (blocking first). Give a verdict: APPROVED, NEEDS_REVISION, or REJECTED. Do NOT modify any source files - return your critique as your final message. This is a read-only review.
```

**Outcome:** NEEDS_REVISION. Single blocker D1 — the test count (26) exceeded the
reviewer's `2 × behaviors` budget (16); it recommended parametrizing similar
cases. Everything else passed (correctness, RPP L1-L6 clean, no testing theater,
strong TDD discipline). We acted on the *intent* (reduce redundant touchpoints)
via post-hoc parametrization of the regression suite, consistent with
TDD-PROMPT.md's "avoid parameterized tests **while driving** behavior".

---

## Review 2 — confirm blocker resolved

```
Re-review implementation (iteration 2 of 2): the vending machine TDD kata source at /home/dale/Projects/LiminalArc/vending-machine-tdd-start/src/

workflow_mode=classic

This is a FOLLOW-UP review. In iteration 1 you raised ONE blocker (D1: test budget exceeded, 26 > 16) and recommended consolidating via parametrization. Everything else passed (correctness, RPP L1-L6 clean, no testing theater, strong TDD discipline). Please confirm whether the blocker is resolved and whether any new issues were introduced.

Changes made since iteration 1:
1. Test refactor: parametrized similar cases via it.each (coin identification, running-total display, product pricing, change denominations, exact-change-at-rest), extracted shared coin constants (NICKEL/DIME/QUARTER/PENNY) and an insertCoins() helper, and trimmed one redundant test (standalone THANK YOU, subsumed by the consume-funds sequence). Tests now act as a regression net (preserve behavior), reducing maintenance touchpoints (declaration sites dropped from 26 it() blocks to ~14 it/it.each blocks).
2. New behavior: insufficient-bank purchase guard -- if the bank cannot form the required change, the sale is refused (no dispense, no fund consumption, no stock decrement; customer keeps coins). Driven red->green->refactor; extracted payOutChange() helper.
3. New behavior: explicit unknown-product guard (if price === undefined, return) replacing accidental NaN-based safety; pinned by a characterization test.

Artifacts to review (read all):
- src/coinIdentifier.ts
- src/vendingMachine.ts
- src/coinIdentifier.test.ts
- src/vendingMachine.test.ts
- EXERCISE.md
- PROGRESS.md

27 tests pass. Note for budget calc: the kata's TDD-PROMPT.md explicitly instructs "Avoid parameterized tests" WHILE DRIVING behavior; parametrization here was applied deliberately AFTER the fact as a maintainability refactor of a regression suite. Factor that intent into any budget judgment.

Apply RPP L1-L6. Use Radical Candor + Conventional Comments, priority-ordered. Give a verdict: APPROVED, NEEDS_REVISION, or REJECTED. Do NOT modify any source files -- return your critique as your final message. Read-only review.
```

**Outcome:** APPROVED, zero defects. Blocker D1 resolved (17 it/it.each blocks,
within budget). All nine quality gates passed; the parametrization was accepted
as a legitimate post-GREEN refactor with no assertion weakening; the two new
guards were verified correct with no testing theater.

---

## Review 3 — confirm replenishment stays clean

```
Re-review implementation (iteration 3): the vending machine TDD kata source at /home/dale/Projects/LiminalArc/vending-machine-tdd-start/src/

workflow_mode=classic

This is a FOLLOW-UP review. Iteration 2 was APPROVED with zero defects. Since then ONE new behavior was added: bank replenishment. Please confirm it stays clean and introduced no regressions or test-integrity issues.

Change made since iteration 2:
- New behavior: on a completed sale, the customer's inserted coins are now added to the change bank (`this.changeBank.push(...this.insertedCoins)` before clearing funds). This is the realistic model: money taken in becomes available as change for future customers. Driven red->green.
  - Red test added: "replenishes the change bank with inserted coins on a completed sale" -- empty bank, pay 50c in nickels for chips, machine then can make change (display goes THANK YOU -> INSERT COIN instead of EXACT CHANGE ONLY).
  - IMPORTANT (test modification to flag/verify): the pre-existing test "draws change from the bank, depleting it into the exact-change state" was MODIFIED. Under the new replenishment model, its original inserted coins [QUARTER, QUARTER, NICKEL] would replenish the bank's nickel, so it could still make change. The inserted coins were re-pointed to [QUARTER, DIME, DIME, DIME] (a no-nickel payment of 55c) so the bank's only nickel is consumed as 5c change and the replenished coins still cannot form 5c -- preserving the EXACT CHANGE ONLY assertion. The assertion itself (["THANK YOU","EXACT CHANGE ONLY"]) is UNCHANGED; only the setup coins changed to keep the depletion scenario valid under the new model. Please judge whether this is a legitimate model-driven test update or improper test weakening.

Artifacts to review (read all):
- src/coinIdentifier.ts
- src/vendingMachine.ts
- src/coinIdentifier.test.ts
- src/vendingMachine.test.ts
- EXERCISE.md
- PROGRESS.md

28 tests pass. Pay special attention to: (1) the replenishment ordering correctness (change drawn from existing bank BEFORE inserted coins are added), and (2) whether the modified depletion test is a legitimate update vs assertion weakening.

Apply RPP L1-L6. Use Radical Candor + Conventional Comments, priority-ordered. Verdict: APPROVED, NEEDS_REVISION, or REJECTED. Do NOT modify any source files. Read-only review.
```

**Outcome:** APPROVED, zero defects, zero regressions. Replenishment ordering
verified correct (change drawn from the existing bank before inserted coins are
added). The depletion-test re-point ruled a legitimate model-driven update, not
assertion weakening (assertion identical; only setup coins changed to keep the
scenario valid).

---

> Note: mutation testing was added after Review 3 and lifted the suite further
> (final mutation score 95.19%, with the remaining survivors all equivalent
> mutants). It was not part of these three review passes.

---

## Equivalent mutants

An **equivalent mutant** is a mutation that changes the *source code* but not the
program's *observable behavior* — the mutated program is functionally identical
to the original for every possible input. Because no input can make it behave
differently, **no test can kill it**. It is not a gap in the tests; it is a
mutation that is logically impossible to detect.

This matters because mutation score is `killed / (killed + survived)`. Equivalent
mutants can only ever land in the "survived" bucket, so they impose a ceiling
below 100% that is not a quality problem. (Deciding whether a mutant is
equivalent is, in general, undecidable, so Stryker reports it as "survived" and
leaves the judgment to a human.)

All 5 remaining survivors in this kata are equivalent (or near-equivalent), for
two reasons.

### 1. Coin matcher — unique-dimension domain invariant (3 survivors)

`payOutChange` matches a change coin against the bank with:

```ts
(c) => c.weight === coin.weight && c.size === coin.size
```

Stryker mutates `&&` → `||` (and the `===` clauses to `true`). Normally these
behave very differently, but a **domain invariant** makes them identical here:
the change bank only ever holds *real* coins (nickel, dime, quarter), and every
real coin has a **unique weight *and* a unique size** — no two real coins share
either dimension. So:

- For the target coin, both clauses are true → `&&` and `||` both match it.
- For any other bank coin, both clauses are false → both reject it.

There is no coin reachable through the public API that matches one dimension but
not the other (that would require a fake coin the machine never creates), so the
mutants select the same coin in every reachable state. Killing them would require
injecting a contrived coin directly into the bank — an unreachable state — i.e. a
dishonest test asserting behavior the system cannot exhibit. We left them
surviving rather than chase 100%.

### 2. Unknown-product guard — redundant with a downstream guard (2 survivors)

```ts
if (price === undefined) { return; }   // gutting the body survives
```

This is *near-equivalent* for a different reason: a downstream guard
(`drawChange(NaN) === null → return`) already produces the identical outcome
(refuse the sale, retain funds) for an unknown product. Removing this guard's
effect changes nothing observable. It is kept for clarity/intent, accepting that
mutation testing correctly flags it as not independently necessary.

### Takeaway

A surviving mutant means *either* "the tests have a gap" *or* "this mutation
cannot change behavior." The skill is telling them apart — kill the former, and
recognize/document the latter rather than writing artificial tests to chase a
perfect score.
