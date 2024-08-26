# Specification for the binary format

### Credits

This specification originated from discussions in the Altered Programming Discord community between:
- Taum
- Maverick
- Aless
- PolluxTroy
- xRyzZ
- Mauc

## General structure

The deck binary string is made of, in order:

1. Exactly 1 `Header` element
2. Any number of `SetGroup` elements
3. Padding bits to align with a byte boundary. Writers SHOULD set these bits to zero. Readers MUST NOT use the value from these bits. These padding bits are added to reach a total number of bits that's a multiple of 8. For instance if 260 bits have been used so far, add 4 bits to reach 264 (such that `264 % 8 == 0`)

The binary string will typically be encoded using Base64 encoding to be shared in a URL-safe format.

## Sub-elements

Unless otherwise noted, all `int` fields represent **unsigned** integer values, i.e. a 3-bit field contains values from 0-7 inclusive, with `(bin)000 = (dec)0` and `(bin)111 = (dec)7`

All multi-bytes values are encoded in _Network Byte Order_, i.e. from most significant bit to least significant bit (a.k.a Big Endian). For instance the value `(dec)12345` on a 16-bit field is encoded as `(bin) 00110000 00111001` / `(hex) 0x3039`

### Header

```
int(4) version
MUST equal 1. All other values are reserved for future iterations

int(8) groups_count
The number of SetGroup entities in this deck
```

### SetGroup

Cards are grouped by sets. This was done to avoid repeating set information, since a lot of cards will be from the same set.

```
int(8) set_code
A code for the set. See Set in IDs section

int(6) refs_count
The number of CardRefQuantity entities in this group

[refs_count ** CardRefQuantity]
contains the cards from this set, and their respective quantity in the deck
```

### CardRefQuantity

Represents a card and quantity. Quantity uses a variable-length encoding (see details after definition block).

```
int(2) quantity
The number of copies of the card in the deck, or 0 if the quantity is higher than 3.

(Optional) int(6) extended_quantity
This MUST be present if and only if quantity == 0 (and the actual quantity of the card is larger than 3)
The number of copies of the card in the deck, minus 3.

[1 ** Card]
exactly 1 Card element, as described in the section below
```

Note that the `quantity` field is in the range 0-3 and works well for constructed decks.

A value higher than 3 (for example for limited decks) can be represented by:
* Setting the `quantity` field to `0`
* Using the `extended_quantity` field instead to represent the number of cards above 3. This lets us represent a number of cards up to 2*6 - 1 + 3 = 65

For example to represent 8 copies of a card, set `quantity = 0` and `extended_quantity = 5`

A card with a quantity of 0 SHOULD be omited. It CAN be represented by setting both the `quantity` and `extended_quantity` fields to `0`.

### Card

Represents a card using the following attributes

* Faction
* Number in faction
* Rarity
* (Optional) unique number

This maps directly to a card ID reference, which uses the text format
`ALT_<set>_<faction>_<number_in_faction>_<rarity>` (optionally followed with a `_<unique_number>` for uniques), e.g. `ALT_CORE_BR_03_C`

Note that the set is implied from the parent `SetGroup` element.

```
int(3) faction
see Faction is IDs section

int(5) number_in_faction
Range 0 - 32 (for reference, core set uses range 1-30, and we expect intermediate sets to be smaller).

int(2) rarity
see Rarity in IDs section

(Optional) int(16) UniqueId
This MUST be present if and only if rarity == unique (int value 3)
Range 1 - 65535
```

## IDs

This section contains the list of IDs that map with there respective plain text representation

### Set

0 is reserved for future use

```
1 = COREKS
2 = CORE
```

### Faction

0 is reserved for future use

```
1 = AX (Axiom)
2 = BR (Bravos)
3 = LY (Lyra)
4 = MU (Muna)
5 = OR (Ordis)
6 = YZ (Yzmir)
7 = NE (Neutral -- e.g. Mana Orb token)
```

### Rarity

```
0 = C  (Common)
1 = R1 (Rare - in faction)
2 = R2 (Rare - out of faction)
3 = U  (Unique)
```