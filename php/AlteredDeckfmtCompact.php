<?php

declare(strict_types=1);

/**
 * Altered TCG — Compact deck format codec (single-file PHP library).
 *
 * PHP port of the Compact binary format (wire version 2) implemented in
 * src/syntax_compact.ts of the altered-deckfmt repository. See
 * FORMAT_SPEC_COMPACT.md for the wire format specification.
 *
 * Compatible with PHP 8.3 and 8.4. No dependencies, no extensions required.
 * Copy this file into your codebase and `require` it.
 *
 * The Compact format is lossy by design:
 *   - Alternate-art / promo product variants are not preserved.
 *   - The set is normalized to a canonical set per card family; only uniques
 *     of the dual CORE/COREKS family keep their CORE-vs-COREKS distinction.
 *   - Exalt rarity ('E') folds into Common ('C').
 *
 * ## Entry array shape
 *
 * Both {@see CompactDeckCodec::encode()} input and
 * {@see CompactDeckCodec::decode()} output are lists of associative arrays:
 *
 *   quantity        int     1..65. Required on encode; always present on decode.
 *   faction         string  One of 'AX','BR','LY','MU','OR','YZ','NE'.
 *                           Required on encode; always present on decode.
 *   numberInFaction int     1..256. Required on encode; always present on decode.
 *   rarity          string  One of 'C','R1','R2','U'. Encode also accepts 'E',
 *                           which is folded to 'C' on the wire. Decode only ever
 *                           emits 'C','R1','R2','U'. Required on encode.
 *   uniqueId        int     Required on encode iff rarity is 'U'
 *                           (1..32767 for dual CORE/COREKS families,
 *                           1..65535 otherwise). Present on decode iff 'U'.
 *   set             string  On encode: only consulted for uniques belonging to a
 *                           dual CORE/COREKS family, where 'COREKS' selects the
 *                           COREKS variant (anything else, or absent, means
 *                           'CORE'); ignored for all other cards (the format is
 *                           lossy). On decode: always present — the canonical
 *                           set name ('CORE','ALIZE','BISE','CYCLONE','DUSTER',
 *                           'EOLE','FUGUE'), or 'CORE'/'COREKS' for dual-family
 *                           uniques.
 *
 * Example:
 *
 *   use AlteredDeckfmt\CompactDeckCodec;
 *
 *   $code = CompactDeckCodec::encode([
 *       ['quantity' => 3, 'faction' => 'AX', 'numberInFaction' => 41, 'rarity' => 'C'],
 *       ['quantity' => 1, 'faction' => 'AX', 'numberInFaction' => 7,
 *        'rarity' => 'U', 'uniqueId' => 5446, 'set' => 'COREKS'],
 *   ]);
 *   $entries = CompactDeckCodec::decode($code);
 *
 * Entries can also be built from card reference IDs
 * (ALT_{SET}_{B|A|P}_{FACTION}_{NIF}_{RARITY}[_{UNIQUE_ID}]) with
 * {@see CompactDeckCodec::entryFromReference()}.
 */

namespace AlteredDeckfmt;

class EncodingException extends \RuntimeException
{
}

class DecodingException extends \RuntimeException
{
}

final class CompactDeckCodec
{
    /** Wire version nibble identifying the Compact format. */
    private const COMPACT_VERSION = 2;

    private const MAX_REFS_PER_FACTION_GROUP = 63;
    private const MAX_QUANTITY = 65;

    private const FACTION_TO_ID = [
        'AX' => 1,
        'BR' => 2,
        'LY' => 3,
        'MU' => 4,
        'OR' => 5,
        'YZ' => 6,
        'NE' => 7,
    ];

    private const ID_TO_FACTION = [
        1 => 'AX',
        2 => 'BR',
        3 => 'LY',
        4 => 'MU',
        5 => 'OR',
        6 => 'YZ',
        7 => 'NE',
    ];

    /** Wire rarity values: C/E => 0, R1 => 1, R2 => 2, U => 3. */
    private const RARITY_TO_WIRE = [
        'C' => 0,
        'E' => 0,
        'R1' => 1,
        'R2' => 2,
        'U' => 3,
    ];

    private const WIRE_TO_RARITY = [
        0 => 'C',
        1 => 'R1',
        2 => 'R2',
        3 => 'U',
    ];

    /**
     * Canonical family table, ported verbatim from src/canonical_sets.ts.
     * Per canonical set: [setName, dualCoreCoreks, [[factionId, minNif, maxNif], ...]].
     */
    private const FAMILY_RANGES_BY_SET = [
        ['CORE',    true,  [[1, 1, 31], [2, 1, 31], [3, 1, 30], [4, 1, 30], [5, 1, 32], [6, 1, 31], [7, 0, 1]]],
        ['ALIZE',   false, [[1, 32, 46], [2, 32, 46], [3, 31, 45], [4, 31, 45], [5, 33, 48], [6, 32, 47], [7, 2, 2]]],
        ['BISE',    false, [[1, 49, 63], [2, 49, 64], [3, 49, 63], [4, 49, 63], [5, 49, 63], [6, 49, 63]]],
        ['CYCLONE', false, [[1, 65, 82], [2, 65, 83], [3, 65, 82], [4, 65, 83], [5, 65, 82], [6, 65, 82], [7, 3, 3]]],
        ['DUSTER',  false, [[1, 85, 102], [2, 86, 102], [3, 86, 102], [4, 85, 102], [5, 85, 102], [6, 86, 102], [7, 4, 4]]],
        ['EOLE',    false, [[1, 106, 122], [2, 105, 123], [3, 105, 122], [4, 106, 122], [5, 106, 122], [6, 105, 122]]],
        ['FUGUE',   false, [[1, 130, 148], [2, 130, 148], [3, 130, 148], [4, 130, 148], [5, 130, 148], [6, 130, 148]]],
    ];

    /**
     * Encode a deck (list of entry arrays, see the file docblock for the shape)
     * into a base64url Compact deck code.
     *
     * Entries that normalize to the same card are merged by summing their
     * quantities. Output ordering follows the spec: faction groups ascending,
     * entries by numberInFaction ascending.
     *
     * @param array<int, array<string, mixed>> $entries
     * @throws EncodingException on invalid input data
     */
    public static function encode(array $entries): string
    {
        // Normalize + merge (identical faction/nif/wireRarity/uniqueWord sum up).
        $merged = [];
        foreach ($entries as $index => $entry) {
            $norm = self::normalizeEntry($entry, $index);
            $key = $norm['faction'] . ':' . $norm['nif'] . ':' . $norm['wireRarity'] . ':' . ($norm['uniqueWord'] ?? '');
            if (isset($merged[$key])) {
                $merged[$key]['quantity'] += $norm['quantity'];
                if ($merged[$key]['quantity'] > self::MAX_QUANTITY) {
                    throw new EncodingException("Merged quantity exceeds " . self::MAX_QUANTITY . " for entry #$index");
                }
            } else {
                $merged[$key] = $norm;
            }
        }

        $allQtyOne = true;
        foreach ($merged as $norm) {
            if ($norm['quantity'] !== 1) {
                $allQtyOne = false;
                break;
            }
        }

        // Group by faction (first-seen order), then sort groups and entries.
        $byFaction = [];
        foreach ($merged as $norm) {
            $byFaction[$norm['faction']][] = $norm;
        }
        ksort($byFaction);

        $groups = [];
        foreach ($byFaction as $factionId => $factionEntries) {
            usort($factionEntries, static fn (array $a, array $b): int => $a['nif'] <=> $b['nif']);
            foreach (array_chunk($factionEntries, self::MAX_REFS_PER_FACTION_GROUP) as $chunk) {
                $groups[] = [$factionId, $chunk];
            }
        }

        if (count($groups) > 255) {
            throw new EncodingException('Cannot encode more than 255 faction groups');
        }

        $writer = new BitWriter();
        $writer->write(4, self::COMPACT_VERSION);
        $writer->write(8, count($groups));
        $writer->write(1, $allQtyOne ? 1 : 0);
        $writer->write(1, 0);
        $writer->write(2, 0);

        foreach ($groups as [$factionId, $chunk]) {
            $writer->write(3, $factionId);
            $writer->write(6, count($chunk));
            foreach ($chunk as $norm) {
                if (!$allQtyOne) {
                    if ($norm['quantity'] <= 3) {
                        $writer->write(2, $norm['quantity']);
                    } else {
                        $writer->write(2, 0);
                        $writer->write(6, $norm['quantity'] - 3);
                    }
                }
                $writer->write(8, $norm['nif'] - 1);
                $writer->write(2, $norm['wireRarity']);
                if ($norm['wireRarity'] === 3) {
                    $writer->write(16, $norm['uniqueWord']);
                }
            }
        }

        return self::base64urlEncode($writer->finish());
    }

    /**
     * Decode a base64url Compact deck code into a list of entry arrays
     * (see the file docblock for the shape).
     *
     * @return array<int, array<string, mixed>>
     * @throws DecodingException on malformed or truncated input
     */
    public static function decode(string $code): array
    {
        $reader = new BitReader(self::base64urlDecode($code));

        $version = $reader->read(4);
        if ($version !== self::COMPACT_VERSION) {
            throw new DecodingException("Invalid version ($version)");
        }

        $groupCount = $reader->read(8);
        $allQtyOne = $reader->read(1) === 1;
        if ($reader->read(1) !== 0 || $reader->read(2) !== 0) {
            throw new DecodingException('Invalid reserved header bits');
        }

        $entries = [];
        for ($g = 0; $g < $groupCount; $g++) {
            $factionId = $reader->read(3);
            if ($factionId === 0) {
                throw new DecodingException('Invalid faction ID (0)');
            }
            $refsCount = $reader->read(6);
            if ($refsCount < 1) {
                throw new DecodingException("Invalid refs_count ($refsCount)");
            }
            for ($i = 0; $i < $refsCount; $i++) {
                $entries[] = self::decodeEntry($reader, $allQtyOne, $factionId);
            }
        }

        return $entries;
    }

    /**
     * Build one entry array from a card reference ID and a quantity.
     *
     * Reference format: ALT_{SET}_{B|A|P}_{FACTION}_{NIF}_{RARITY}[_{UNIQUE_ID}]
     * e.g. 'ALT_COREKS_B_AX_07_U_5446'. The product letter (B/A/P) is accepted
     * but discarded (the Compact format is lossy). The rarity is kept as given,
     * including 'E' (encode() folds it to 'C').
     *
     * @return array<string, mixed>
     * @throws EncodingException on an unrecognized reference ID
     */
    public static function entryFromReference(string $referenceId, int $quantity): array
    {
        if (!preg_match('/^ALT_(\w+)_(A|B|P)_(\w{2})_(\d+)_(C|R1|R2|U|E)(?:_(\d+))?$/', $referenceId, $m)) {
            throw new EncodingException("Unrecognized card reference ID '$referenceId'");
        }
        [, $set, , $faction, $nif, $rarity] = $m;
        if (!isset(self::FACTION_TO_ID[$faction])) {
            throw new EncodingException("Unrecognized faction '$faction' in reference ID '$referenceId'");
        }
        if ($rarity === 'U' && !isset($m[6])) {
            throw new EncodingException("Unique card reference '$referenceId' is missing a unique ID");
        }

        $entry = [
            'quantity' => $quantity,
            'faction' => $faction,
            'numberInFaction' => (int)$nif,
            'rarity' => $rarity,
        ];
        if (isset($m[6])) {
            $entry['uniqueId'] = (int)$m[6];
        }
        $entry['set'] = $set;
        return $entry;
    }

    /**
     * Validate one input entry and reduce it to its wire representation.
     *
     * @param array<string, mixed> $entry
     * @return array{quantity: int, faction: int, nif: int, wireRarity: int, uniqueWord: ?int}
     */
    private static function normalizeEntry(array $entry, int|string $index): array
    {
        foreach (['quantity', 'faction', 'numberInFaction', 'rarity'] as $requiredKey) {
            if (!isset($entry[$requiredKey])) {
                throw new EncodingException("Entry #$index is missing required key '$requiredKey'");
            }
        }

        $quantity = $entry['quantity'];
        if (!is_int($quantity) || $quantity < 1 || $quantity > self::MAX_QUANTITY) {
            throw new EncodingException("Entry #$index has invalid quantity (expected int 1.." . self::MAX_QUANTITY . ")");
        }

        $faction = $entry['faction'];
        if (!is_string($faction) || !isset(self::FACTION_TO_ID[$faction])) {
            throw new EncodingException("Entry #$index has invalid faction (expected one of " . implode(',', array_keys(self::FACTION_TO_ID)) . ")");
        }
        $factionId = self::FACTION_TO_ID[$faction];

        $nif = $entry['numberInFaction'];
        if (!is_int($nif) || $nif < 1 || $nif > 256) {
            throw new EncodingException("Entry #$index has invalid numberInFaction (expected int 1..256)");
        }

        $rarity = $entry['rarity'];
        if (!is_string($rarity) || !isset(self::RARITY_TO_WIRE[$rarity])) {
            throw new EncodingException("Entry #$index has invalid rarity (expected one of C,R1,R2,U,E)");
        }
        $wireRarity = self::RARITY_TO_WIRE[$rarity];

        $meta = self::getFamilyMeta($factionId, $nif);
        if ($meta === null) {
            throw new EncodingException("Unknown family (faction=$faction, numberInFaction=$nif) in entry #$index");
        }

        $uniqueWord = null;
        if ($wireRarity === 3) {
            $uniqueId = $entry['uniqueId'] ?? null;
            if (!is_int($uniqueId)) {
                throw new EncodingException("Entry #$index is a unique card but is missing an int 'uniqueId'");
            }
            if ($meta['dual']) {
                if ($uniqueId < 1 || $uniqueId > 32767) {
                    throw new EncodingException("Entry #$index has uniqueId out of range for dual CORE/COREKS family ($uniqueId)");
                }
                $isCoreks = ($entry['set'] ?? null) === 'COREKS' ? 1 : 0;
                $uniqueWord = ($uniqueId << 1) | $isCoreks;
            } else {
                if ($uniqueId < 1 || $uniqueId > 65535) {
                    throw new EncodingException("Entry #$index has uniqueId out of range ($uniqueId)");
                }
                $uniqueWord = $uniqueId;
            }
        }

        return [
            'quantity' => $quantity,
            'faction' => $factionId,
            'nif' => $nif,
            'wireRarity' => $wireRarity,
            'uniqueWord' => $uniqueWord,
        ];
    }

    /** @return array<string, mixed> */
    private static function decodeEntry(BitReader $reader, bool $allQtyOne, int $factionId): array
    {
        if ($allQtyOne) {
            $quantity = 1;
        } else {
            $quantity = $reader->read(2);
            if ($quantity === 0) {
                $extended = $reader->read(6);
                $quantity = $extended === 0 ? 0 : $extended + 3;
            }
        }

        $nif = $reader->read(8) + 1;
        $wireRarity = $reader->read(2);

        $meta = self::getFamilyMeta($factionId, $nif);
        if ($meta === null) {
            throw new DecodingException("Unknown family (faction=$factionId, nif=$nif)");
        }

        $entry = [
            'quantity' => $quantity,
            'faction' => self::ID_TO_FACTION[$factionId],
            'numberInFaction' => $nif,
            'rarity' => self::WIRE_TO_RARITY[$wireRarity],
        ];

        if ($wireRarity === 3) {
            $uniqueWord = $reader->read(16);
            if ($meta['dual']) {
                $uniqueId = $uniqueWord >> 1;
                if ($uniqueId < 1) {
                    throw new DecodingException("Invalid dual-family unique_id ($uniqueId)");
                }
                $entry['uniqueId'] = $uniqueId;
                $entry['set'] = ($uniqueWord & 1) === 1 ? 'COREKS' : 'CORE';
            } else {
                if ($uniqueWord < 1) {
                    throw new DecodingException("Invalid unique_id ($uniqueWord)");
                }
                $entry['uniqueId'] = $uniqueWord;
                $entry['set'] = $meta['set'];
            }
        } else {
            $entry['set'] = $meta['set'];
        }

        return $entry;
    }

    /** @return ?array{set: string, dual: bool} */
    private static function getFamilyMeta(int $factionId, int $nif): ?array
    {
        foreach (self::FAMILY_RANGES_BY_SET as [$setName, $dual, $ranges]) {
            foreach ($ranges as [$fid, $minNif, $maxNif]) {
                if ($factionId === $fid && $nif >= $minNif && $nif <= $maxNif) {
                    return ['set' => $setName, 'dual' => $dual];
                }
            }
        }
        return null;
    }

    private static function base64urlEncode(string $bytes): string
    {
        return rtrim(strtr(base64_encode($bytes), '+/', '-_'), '=');
    }

    private static function base64urlDecode(string $code): string
    {
        $base64 = strtr($code, '-_', '+/');
        $padded = str_pad($base64, (int)(ceil(strlen($base64) / 4) * 4), '=');
        $bytes = base64_decode($padded, true);
        if ($bytes === false) {
            throw new DecodingException('Invalid base64url input');
        }
        return $bytes;
    }
}

/**
 * Big-endian bitstream writer (most significant bit of each byte first).
 * @internal
 */
final class BitWriter
{
    private string $bytes = '';
    /** Pending bits not yet flushed to a full byte, kept right-aligned. */
    private int $acc = 0;
    private int $accBits = 0;

    public function write(int $width, int $value): void
    {
        $this->acc = ($this->acc << $width) | ($value & ((1 << $width) - 1));
        $this->accBits += $width;
        while ($this->accBits >= 8) {
            $this->accBits -= 8;
            $this->bytes .= chr(($this->acc >> $this->accBits) & 0xFF);
        }
        $this->acc &= (1 << $this->accBits) - 1;
    }

    /** Zero-pad to a byte boundary and return the byte string. */
    public function finish(): string
    {
        if ($this->accBits > 0) {
            $this->write(8 - $this->accBits, 0);
        }
        return $this->bytes;
    }
}

/**
 * Big-endian bitstream reader (most significant bit of each byte first).
 * @internal
 */
final class BitReader
{
    private int $bitPos = 0;
    private readonly int $bitLength;

    public function __construct(private readonly string $bytes)
    {
        $this->bitLength = strlen($bytes) * 8;
    }

    public function read(int $width): int
    {
        if ($this->bitPos + $width > $this->bitLength) {
            throw new DecodingException('Unexpected end of data');
        }
        $result = 0;
        for ($i = 0; $i < $width; $i++) {
            $byte = ord($this->bytes[$this->bitPos >> 3]);
            $result = ($result << 1) | (($byte >> (7 - ($this->bitPos & 7))) & 1);
            $this->bitPos++;
        }
        return $result;
    }
}
