# Specification for the binary format (V3)

### Credits

This specification originated from discussions in the Altered Programming Discord community between:
- Taum
- Maverick
- Aless
- PolluxTroy
- xRyzZ
- Mauc
- Ajordat

This document describes **version 3** of the binary deck format, matching the implementation in `src/syntax_v3.ts`.

## General structure

The deck binary string is made of, in order:

1. Exactly 1 `Header` element
2. Any number of `SetGroup` elements (as specified by `Header.groups_count`)
3. Padding bits to align with a byte boundary. Writers SHOULD set these bits to zero. Readers MUST NOT use the value from these bits. These padding bits are added to reach a total number of bits that's a multiple of 8.

The binary string will typically be encoded using Base64 encoding to be shared in a URL-safe format.

This format allows for encoding card IDs that do not actually exist in the game (e.g. reprint combinations). Encoders and decoders do not need to validate real-world card existence; applications using the format are expected to handle such validation if needed.

## Sub-elements

Unless otherwise noted, all `int(N)` fields represent **unsigned** integer values.

All multi-byte values are encoded in _Network Byte Order_ (Big Endian). For example, the 16-bit value `(dec)12345` is `(bin) 00110000 00111001` / `(hex) 0x3039`.

### Header

```
int(4) version
MUST equal 3. All other values are reserved for future iterations.

int(8) groups_count
The number of SetGroup entities in this deck.
```

### SetGroup

Cards are grouped by set to avoid repeating set information.

V3 encodes the set identifier as a compact **set name** string rather than a numeric set code.

```
int(4) set_name_len_minus_1
Actual length = set_name_len_minus_1 + 1
Valid lengths: 1..16 characters

[set_name_len ** int(6) set_name_char]
Each character is encoded as one 6-bit symbol using the alphabet [A-Z0-9]:
  - 0..25  => 'A'..'Z'
  - 26..35 => '0'..'9'
Values 36..63 are invalid and MUST be rejected by decoders.

int(6) refs_count
The number of CardRefQuantity entities in this group.

(Optional) int(4) family_id_bit_length
This MUST be present if and only if refs_count > 1.
This is the number of bits used for the `number_in_faction_offset` field on all cards in this group except the first.
Valid range: 0..15 (inclusive).

[refs_count ** CardRefQuantity]
Contains the cards from this set, and their respective quantity in the deck.
```

It is valid to have multiple `SetGroup` elements with the same set name, and decoders MUST support it. Encoders SHOULD split a list of cards where more than 63 cards are from the same set into multiple `SetGroup` elements.

#### Ordering requirement (V3)

To make decoding unambiguous without storing `family_id_min` explicitly, encoders MUST ensure that within each `SetGroup`, the first encoded card has `number_in_faction == family_id_min` for the group.

The reference implementation achieves this by sorting the group’s cards by `number_in_faction` ascending prior to encoding.

### CardRefQuantity

Represents a card and quantity. Quantity uses a variable-length encoding.

```
int(2) quantity
The number of copies of the card in the deck, or 0 if the quantity is higher than 3.

(Optional) int(6) extended_quantity
This MUST be present if and only if quantity == 0 (and the actual quantity of the card is larger than 3).
The number of copies of the card in the deck, minus 3.

[1 ** Card]
Exactly 1 Card element.
```

If `quantity > 0 && quantity <= 3`, then it is fully represented by `quantity`.

If the real quantity is greater than 3, represent it by:
- setting `quantity = 0`
- setting `extended_quantity = real_quantity - 3`

This represents quantities up to \(2^6 - 1 + 3 = 66\), however the reference encoder restricts the maximum representable non-zero quantity to **65**.

A card with a quantity of 0 SHOULD be omitted. It CAN be represented by setting both `quantity` and `extended_quantity` to 0.

### Card

Represents a card using the following attributes:

- Product
- Faction
- Number in faction (with per-SetGroup compression)
- Rarity
- (Optional) unique number

This maps directly to a card ID reference, which uses the text format:
`ALT_<set_name>_<product>_<faction>_<number_in_faction>_<rarity>` (optionally followed with a `_<unique_number>` for uniques),
e.g. `ALT_CORE_B_BR_03_C`.

Note that the set name is implied from the parent `SetGroup` element.

```
int(1) booster_product
1 if the Product is a booster (_B_), 0 otherwise. If 0, `product` MUST be present.

(Optional) int(2) product
This MUST be present if and only if booster_product == 0.
See Product in IDs section.

int(3) faction
See Faction in IDs section.

// V3 encoding of number_in_faction:

If this Card is the first card in its SetGroup:
  int(12) number_in_faction
  This value is also used as family_id_min for subsequent cards in the group.

Else (not the first card in its SetGroup):
  int(family_id_bit_length) number_in_faction_offset
  The decoded number_in_faction MUST equal family_id_min + number_in_faction_offset.

int(variable-length) rarity
The bit length depends on the set being decoded (see Rarity in IDs section).

(Optional) int(16) unique_id
This MUST be present if and only if rarity == unique (int value 3).
Range: 1 - 65535.
```

## IDs

This section contains the list of IDs that map with their respective plain text representation.

### Set name

The `set_name` token in `ALT_<set_name>_...` is the same string encoded in the `SetGroup` header.

The reference implementation supports the following set names:

```
COREKS
CORE
ALIZE
BISE
TCS3
WCQ25
WCS25
CYCLONE
DUSTER
DUSTERTOP
DUSTERCB
DUSTEROP
```

### Product

0 is reserved for future use.

```
1 = P (Promotion: _P_)
2 = A (AltArt: _A_)
```

### Faction

0 is reserved for future use.

```
1 = AX (Axiom)
2 = BR (Bravos)
3 = LY (Lyra)
4 = MU (Muna)
5 = OR (Ordis)
6 = YZ (Yzmir)
7 = NE (Neutral)
```

### Rarity

The rarity codes are:

```
0 = C  (Common)
1 = R1 (Rare - in faction)
2 = R2 (Rare - out of faction)
3 = U  (Unique)
4 = E  (Exalt)
```

The rarity bit length depends on the set:

| Set | Number of bits | Notes |
| --- | -------------- | --- |
| `COREKS`, `CORE` | 2 |
| `ALIZE` | 2 |
| `BISE` | 2 |
| `TCS3` | 2 |
| `WCQ25` | 2 |
| `WCS25` | 2 |
| `CYCLONE` | 2 |
| `DUSTER` | 3 |
| `DUSTERTOP` | 2 |
| `DUSTERCB` | 3 |
| `DUSTEROP` | 3 |

