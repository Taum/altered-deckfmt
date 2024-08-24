# Specification for the binary format

## General structure

The deck binary string is made of, in order:

1. Exactly 1 `Header` element
2. Any number of `SetGroup` elements
3. Padding bits to align with a byte boundary. Writers SHOULD set these bits to zero. Readers MUST NOT use the value from these bits. These padding bits are added to reach a total number of bits that's a multiple of 8. For instance if 260 bits have been used so far, add 4 bits to reach 264 (such that `264 % 8 == 0`)

The binary string will typically be encoded using Base64 encoding to be shared in a URL-safe format.

## Sub-elements

Unless otherwise noted, all `int` fields represent **unsigned** integer values, i.e. a 3-bit field contains values from 0-7 inclusive, with `(bin)000 = (dec)0` and `(bin)111 = (dec)7`

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

int(8) refs_count
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

(Optional) UniqueId
This MUST be present if and only if rarity == unique (int value 3)
this field uses variable-length encoding, see UniqueId section below for details
```

### UniqueId

A variable-length field for unique ID.

Supports range of 0 - 12,287 using 14 bits
Supports up to 1,060,863 using an additional byte (22 bits)

1. Values from 0 to 12,287 (0x0 - 0x2FFF) inclusive are simply encoded on 14 bits as unsigned integer values
2. Values from 12,288 to 1,060,863 (0x3000 - 0x102FFF) are represented by two initial `1` bits, followed by a 20-bit unsigned integer. Add 12,288 to the integer to get the final value.

For some example of (2) :
```
dec   | binary
12288 = 11 0000 0000 0000 0000 0000 (0 + 12288)
12289 = 11 0000 0000 0000 0000 0001 (1 + 12288)
12345 = 11 0000 0000 0000 0011 1001 (57 + 12288)
and so on up to 11 1111 ... 1111 = (2*20-1) + 12288 = 1060863 (0xFFFFF + 0x3000 = 0x102FFF)
```

This is design is roughly inspired by UTF-8 variable-length encoding, and takes advantage of the fact that all the uniques we've seen so far as numbered below 10,000 while still keeping the door open to represent uniques up to ~1million, way more than we should ever need.

## IDs

This section contains the list of IDs that map with there respective plain text representation

### Set

0 is reserved for future use

```
1 = CORE
2 = COREKS
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