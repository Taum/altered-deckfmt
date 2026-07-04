# Specification for the Compact binary format

This document describes the **Compact** deck format, matching the implementation in `src/syntax_compact.ts`.

The Compact format is an alternative to the standard format (see [FORMAT_SPEC.md](FORMAT_SPEC.md)). It trades losslessness for smaller codes and is intended for sharing deck *contents* where physical variants do not matter.

## What the Compact format does not preserve

Unlike the standard format, the Compact format is **lossy** by design:

- **Alternate/Promo variants are not tracked.** The product dimension (`A` alt-art, `P` promo, `B` booster) is dropped from the wire format. Every card decodes back as booster (`B`).
- **Set is normalized.** The set is not stored on the wire; decoders reconstruct it from a canonical `(faction, number_in_faction) → set` lookup table in `src/canonical_sets.ts`. The **only** exception is uniques from the dual **CORE / COREKS** family, where a single bit distinguishes the two so those uniques survive a round-trip.
- **Exalt (`E`) folds into Common (`C`).** `E` and `C` share the same wire rarity and always decode as `C`.

As a consequence, a round-trip through the Compact format will **not** reproduce the original lines when the input used alt-art, promo, Exalt, or a non-canonical physical set. Applications that need to preserve those must use the standard format.

## General structure

The deck binary string is made of, in order:

1. Exactly 1 `Header` element
2. Any number of `FactionGroup` elements (as specified by `Header.group_count`)
3. Padding bits to align with a byte boundary. Writers SHOULD set these bits to zero. Readers MUST NOT use the value from these bits.

The binary string is encoded using **base64url** for URL-safe sharing.

Encoders and decoders do not validate real-world card existence beyond the canonical family table; applications may add such validation if needed.

## Sub-elements

Unless otherwise noted, all `int(N)` fields represent **unsigned** integer values in big-endian bit order within the bitstream.

### Header (16 bits)

```
int(4)  version
MUST equal 2. This value identifies the Compact format and distinguishes it
from the standard format (which uses version 1).

int(8)  group_count
Number of FactionGroup elements (0..256).

int(1)  all_qty_one
If 1, every entry has implicit quantity 1 and per-entry quantity fields are omitted.

int(1)  reserved
MUST be 0.

int(2)  reserved
MUST be 0.
```

### FactionGroup

Entries are grouped by faction to avoid repeating `faction_id` on every card.

```
int(3)  faction_id
1=AX, 2=BR, 3=LY, 4=MU, 5=OR, 6=YZ, 7=NE.
MUST NOT be 0.

int(6)  refs_count
Number of Entry elements in this group (1..63).

[refs_count × Entry]
```

Encoders MUST sort `FactionGroup` elements by `faction_id` ascending. Entries within each group MUST be sorted by `number_in_faction` ascending.

It is valid to have multiple `FactionGroup` elements with the same `faction_id` when a faction exceeds 63 entries; decoders MUST support this.

### Entry

Each entry is encoded **in this order** (quantity-first):

```
1. Quantity     variable length; omitted when Header.all_qty_one == 1
2. NIF          int(8) number_in_faction_minus_1
3. Rarity       int(2)
4. Unique word  int(16); present if and only if Rarity == 3 (U)
```

#### 1. Quantity

When `all_qty_one = 0`:

```
int(2) quantity
  1..3 => quantity
  0    => read int(6) extended_quantity; real qty = extended + 3 (max 65)
  (extended_quantity == 0 encodes quantity 0, which decoders SHOULD treat as invalid in deck lists)
```

When `all_qty_one = 1`, omit the quantity field entirely (implicit quantity 1).

#### 2. NIF

```
int(8)  number_in_faction_minus_1
Range 0..255 (number_in_faction 1..256).
```

#### 3. Rarity

```
0 = C   Common (`E` Exalt also encodes as 0 on the wire)
1 = R1  Rare in-faction
2 = R2  Rare out-of-faction
3 = U   Unique
```

Decoders emit `C` for wire value 0 (never `E`).

#### 4. Unique word (only when Rarity == 3)

Interpretation depends on whether `(faction_id, number_in_faction)` is a **dual CORE/COREKS family** (see `dualCoreCoreks` in `src/canonical_sets.ts`).

**Dual CORE/COREKS family:**

```
int(16) unique_word
  bit 0       is_coreks: 0 = CORE, 1 = COREKS
  bits 1..15  unique_id: range 1..32767 (unique_id 0 in payload is invalid)
```

**All other unique families:**

```
int(16) unique_id
Range 1..65535 (0 reserved/invalid). Set name comes from the canonical family table on decode.
```

## Encode-time normalization

Before writing entries, encoders SHOULD:

1. Parse text card IDs.
2. Strip set and product; map `E` and `C` to wire rarity `0`.
3. For dual-family uniques, pack `is_coreks` (from input set `CORE` vs `COREKS`) into bit 0 of the unique word.
4. Merge lines with identical `(faction, nif, wire_rarity, unique_word)` by summing quantity.
5. Group by `faction_id`; sort groups and entries as above.
6. Set `all_qty_one = 1` iff every merged quantity is 1.

Families not present in the canonical table MUST be rejected by encoders.

## Decode-time text reconstruction

Decoders rebuild card IDs as:

```
ALT_{set}_{B}_{faction}_{nif}_{rarity}[_unique_id]
```

- **`set`**: from `src/canonical_sets.ts` for non-unique cards and non-dual uniques; `CORE` or `COREKS` from bit 0 for dual-family uniques.
- **`B`**: always booster (alt-art/promo distinction is discarded).
- **`nif` padding**: leading zero when nif < 10, except NE in CORE/COREKS.
- **`rarity`**: `C`, `R1`, `R2`, or `U_{id}`.

## Reference implementation

- Codec: `src/syntax_compact.ts`
- Public API: `encodeListCompact` / `decodeListCompact` in `src/encoder.ts`
- Canonical family table: `src/canonical_sets.ts` (generated by `scripts/generate-canonical-sets.cjs`)
