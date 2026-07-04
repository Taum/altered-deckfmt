<?php

declare(strict_types=1);

/**
 * Usage example for the Compact deck format PHP library.
 *
 * Run with: php php/example.php
 */

require __DIR__ . '/AlteredDeckfmtCompact.php';

use AlteredDeckfmt\CompactDeckCodec;

// A deck is a list of entry arrays. See the docblock in
// AlteredDeckfmtCompact.php for the full description of each key.
$deck = [
    ['quantity' => 3, 'faction' => 'AX', 'numberInFaction' => 41, 'rarity' => 'C'],
    ['quantity' => 2, 'faction' => 'AX', 'numberInFaction' => 42, 'rarity' => 'R1'],
    ['quantity' => 1, 'faction' => 'YZ', 'numberInFaction' => 5, 'rarity' => 'R2'],
    // A unique from the dual CORE/COREKS family: 'set' selects the variant.
    ['quantity' => 1, 'faction' => 'AX', 'numberInFaction' => 7, 'rarity' => 'U', 'uniqueId' => 5446, 'set' => 'COREKS'],
    // 'E' (Exalt) is accepted and folds into 'C' on the wire (lossy format).
    ['quantity' => 1, 'faction' => 'AX', 'numberInFaction' => 138, 'rarity' => 'E'],
];

// Entries can also be built from card reference IDs:
$deck[] = CompactDeckCodec::entryFromReference('ALT_CORE_B_LY_28_C', 3);

$code = CompactDeckCodec::encode($deck);
echo "Encoded deck code:\n  $code\n\n";

$decoded = CompactDeckCodec::decode($code);
echo "Decoded entries:\n";
foreach ($decoded as $entry) {
    printf(
        "  %2d x %s #%-3d %-2s set=%s%s\n",
        $entry['quantity'],
        $entry['faction'],
        $entry['numberInFaction'],
        $entry['rarity'],
        $entry['set'],
        isset($entry['uniqueId']) ? " uniqueId={$entry['uniqueId']}" : '',
    );
}
