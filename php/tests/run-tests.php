<?php

declare(strict_types=1);

/**
 * Zero-dependency test runner for the Compact deck format PHP library.
 *
 * Run with: php php/tests/run-tests.php
 * Exits 0 when all tests pass, 1 otherwise.
 *
 * The file-based tests use the same input decklist files and the same expected
 * base64url deck codes as the TypeScript suite (test/codec_compact.test.ts),
 * proving that the PHP and TypeScript implementations are wire-compatible.
 */

require __DIR__ . '/../AlteredDeckfmtCompact.php';

use AlteredDeckfmt\CompactDeckCodec;
use AlteredDeckfmt\DecodingException;
use AlteredDeckfmt\EncodingException;

// ---------------------------------------------------------------------------
// Minimal test harness
// ---------------------------------------------------------------------------

$GLOBALS['__passed'] = 0;
$GLOBALS['__failed'] = 0;

function test(string $name, callable $fn): void
{
    try {
        $fn();
        $GLOBALS['__passed']++;
        echo "PASS  $name\n";
    } catch (Throwable $e) {
        $GLOBALS['__failed']++;
        echo "FAIL  $name\n      {$e->getMessage()}\n";
    }
}

function assertSame(mixed $expected, mixed $actual, string $context = ''): void
{
    if ($expected !== $actual) {
        $prefix = $context === '' ? '' : "$context: ";
        throw new AssertionError(
            $prefix . 'expected ' . var_export($expected, true) . ' but got ' . var_export($actual, true)
        );
    }
}

function assertTrue(bool $condition, string $context): void
{
    if (!$condition) {
        throw new AssertionError($context);
    }
}

/** @param class-string<Throwable> $exceptionClass */
function assertThrows(callable $fn, string $exceptionClass, string $messagePattern = ''): void
{
    try {
        $fn();
    } catch (Throwable $e) {
        if (!($e instanceof $exceptionClass)) {
            throw new AssertionError("expected $exceptionClass but got " . get_class($e) . ": {$e->getMessage()}");
        }
        if ($messagePattern !== '' && !preg_match($messagePattern, $e->getMessage())) {
            throw new AssertionError("exception message '{$e->getMessage()}' does not match $messagePattern");
        }
        return;
    }
    throw new AssertionError("expected $exceptionClass but nothing was thrown");
}

// ---------------------------------------------------------------------------
// Test-harness helper: convert the repo's plain-text decklist files into the
// structured entries the PHP API expects. Mirrors parseDeckList() in
// src/encoder.ts (lines are "N REFERENCE_ID"; blank/malformed/qty-0 lines are
// skipped). The plain-text format is a test fixture concern, not API surface.
// ---------------------------------------------------------------------------

/** @return array<int, array<string, mixed>> */
function parseDecklistFile(string $path): array
{
    $content = file_get_contents($path);
    assertTrue($content !== false, "could not read $path");

    $entries = [];
    foreach (explode("\n", $content) as $line) {
        if (preg_match('/^(\d+) (\w+)$/', trim($line), $m)) {
            $quantity = (int)$m[1];
            if ($quantity > 0) {
                $entries[] = CompactDeckCodec::entryFromReference($m[2], $quantity);
            }
        }
    }
    return $entries;
}

/**
 * Order-insensitive comparison of two entry lists (mirrors the TS tests'
 * splitTrimSort semantic comparison).
 *
 * @param array<int, array<string, mixed>> $expected
 * @param array<int, array<string, mixed>> $actual
 */
function assertSameEntries(array $expected, array $actual, string $context): void
{
    $canonicalize = static function (array $entries): array {
        $keys = array_map(static function (array $e): string {
            ksort($e);
            return json_encode($e, JSON_THROW_ON_ERROR);
        }, $entries);
        sort($keys);
        return $keys;
    };
    assertSame($canonicalize($expected), $canonicalize($actual), $context);
}

// ---------------------------------------------------------------------------
// File-based cross-language tests
// (same inputs and golden codes as test/codec_compact.test.ts)
// ---------------------------------------------------------------------------

$repoRoot = dirname(__DIR__, 2);

$expectedEncodedCompact = [
    'test/decklists/real_examples/standard_1.txt' => 'IEAmoAQMINlUah-GGOJmKmOuUGUuemlimGnDB1GoMMWDwSQnH0NKYA',
    'test/decklists/real_examples/standard_2.txt' => 'IDBBYlZDNKDhFDFhFyISIhQCQ1QxRmRiXVYMebVgyd3WDIe6YSZDZSBRBR3A',
    'test/decklists/real_examples/standard_3.txt' => 'IDBBYlZDNKDhFDFhFyISIhQCQ1QxRmRiXVYMebVgyd3WDIe6YSZDZSBRBR3A',
    'test/decklists/real_examples/singleton_1.txt' => 'IFhEAsFRjGcbx7JkyTIBIXiKO48k-VpepEAAGg6GAahwHoiiaKIsjCNo8kCSpOFKVhimSapsnahKKpinKurAsq4ryxNHDIbjGRpNk6W7CGcqyzLk',
    'test/decklists/real_examples/singleton_2.txt' => 'IGghA0ZSDEIfkWYIdQYejGQ5EkaR62gaCIKA6DgQhAGAaBqHofmfMJImi4MBKE4UhSlQYBiGKZBkmiah0nQfCAIKhCEouJqyMIyjqQpGQzqaJyoCi4MKyAFC4Tg',
    'test/decklists/real_examples/sandbox_1.txt' => 'IGAlQsxFRJRQSrTATCUSUVUYIaBWEmGiRKYiixkw-xMx5SZSaTGUJURUlQWC2HmO6TWZWkw1RfSTSey1S6zFTxUYa6A0BCmDUBEmFCFmFyGWGmHWH2ImJGJmJyKGKWKkBLCMGORQABQySmSyTCTWTiTyUSVWVmV2WmXyYCYWYmZGZWbWdgBeShGkABkg',
    'test/decklists/real_examples/sandbox_2.txt' => 'IGAnoMoQoaQqIupGJKJpJzKCKKKMKSqerCI5ABDFDJDREBGxHRLRMxORPxSBXhXxkwkIrJIJMJjJ2J4J8KGQtBhChFBGlHRIhIxPRTBVZWSloJISoUI0Q2JApsKDKOKSqbYxCFDlGBGhGxJRKRORPRPhSxZA',
];

foreach ($expectedEncodedCompact as $relPath => $expectedCode) {
    test("file $relPath encodes to the TypeScript golden code", function () use ($repoRoot, $relPath, $expectedCode) {
        $entries = parseDecklistFile("$repoRoot/$relPath");
        assertTrue(count($entries) > 0, 'fixture parsed to zero entries');

        // Cross-language proof: PHP must produce the exact bytes TS produces.
        $encoded = CompactDeckCodec::encode($entries);
        assertSame($expectedCode, $encoded, 'encode');

        // Stable round-trip: decode then re-encode reproduces the same code.
        $decoded = CompactDeckCodec::decode($encoded);
        assertSame($expectedCode, CompactDeckCodec::encode($decoded), 're-encode of decoded entries');

        // Decode output is the Compact-canonical form of the input deck.
        $normalized = CompactDeckCodec::decode(CompactDeckCodec::encode($entries));
        assertSameEntries($normalized, $decoded, 'decoded vs normalized');
    });
}

// ---------------------------------------------------------------------------
// Validation tests (port of the 'encoding validations' block in
// test/codec_compact.test.ts, adapted to the structured API)
// ---------------------------------------------------------------------------

test('throws when encoding an unknown family', function () {
    assertThrows(
        static fn () => CompactDeckCodec::encode([
            ['quantity' => 1, 'faction' => 'AX', 'numberInFaction' => 200, 'rarity' => 'C'],
        ]),
        EncodingException::class,
        '/Unknown family/i',
    );
});

test('folds Exalt to Common on decode', function () {
    $entries = [CompactDeckCodec::entryFromReference('ALT_FUGUE_A_AX_138_E', 1)];
    $decoded = CompactDeckCodec::decode(CompactDeckCodec::encode($entries));
    assertSame(1, count($decoded));
    assertSame('C', $decoded[0]['rarity']);
    assertSame('FUGUE', $decoded[0]['set']);
    assertSame(138, $decoded[0]['numberInFaction']);
});

test('preserves CORE vs COREKS for dual-family uniques', function () {
    $coreks = [CompactDeckCodec::entryFromReference('ALT_COREKS_B_AX_07_U_5446', 1)];
    $core = [CompactDeckCodec::entryFromReference('ALT_CORE_B_AX_07_U_5446', 1)];

    $decodedCoreks = CompactDeckCodec::decode(CompactDeckCodec::encode($coreks));
    assertSame('COREKS', $decodedCoreks[0]['set']);
    assertSame(5446, $decodedCoreks[0]['uniqueId']);

    $decodedCore = CompactDeckCodec::decode(CompactDeckCodec::encode($core));
    assertSame('CORE', $decodedCore[0]['set']);
    assertSame(5446, $decodedCore[0]['uniqueId']);

    assertTrue(
        CompactDeckCodec::encode($coreks) !== CompactDeckCodec::encode($core),
        'CORE and COREKS variants must encode differently',
    );
});

test('merges identical Compact keys and sums quantity', function () {
    // Same card given twice (the TS test uses B and A products; the product
    // is not part of the structured API and never reaches the wire).
    $decoded = CompactDeckCodec::decode(CompactDeckCodec::encode([
        CompactDeckCodec::entryFromReference('ALT_CORE_B_AX_01_C', 2),
        CompactDeckCodec::entryFromReference('ALT_CORE_A_AX_01_C', 1),
    ]));
    assertSame(1, count($decoded));
    assertSame(3, $decoded[0]['quantity']);
});

test('encodes an empty deck', function () {
    $empty = CompactDeckCodec::encode([]);
    assertSame([], CompactDeckCodec::decode($empty));
    assertSame($empty, CompactDeckCodec::encode([]));
});

test('round-trips extended quantities (4 and 65)', function () {
    $entries = [
        ['quantity' => 4, 'faction' => 'AX', 'numberInFaction' => 1, 'rarity' => 'C'],
        ['quantity' => 65, 'faction' => 'YZ', 'numberInFaction' => 2, 'rarity' => 'C'],
    ];
    $decoded = CompactDeckCodec::decode(CompactDeckCodec::encode($entries));
    assertSameEntries([
        ['quantity' => 4, 'faction' => 'AX', 'numberInFaction' => 1, 'rarity' => 'C', 'set' => 'CORE'],
        ['quantity' => 65, 'faction' => 'YZ', 'numberInFaction' => 2, 'rarity' => 'C', 'set' => 'CORE'],
    ], $decoded, 'extended quantities');
});

test('rejects quantities above 65', function () {
    assertThrows(
        static fn () => CompactDeckCodec::encode([
            ['quantity' => 66, 'faction' => 'AX', 'numberInFaction' => 1, 'rarity' => 'C'],
        ]),
        EncodingException::class,
        '/quantity/i',
    );
    // Also when the limit is only exceeded after merging.
    assertThrows(
        static fn () => CompactDeckCodec::encode([
            ['quantity' => 60, 'faction' => 'AX', 'numberInFaction' => 1, 'rarity' => 'C'],
            ['quantity' => 6, 'faction' => 'AX', 'numberInFaction' => 1, 'rarity' => 'C'],
        ]),
        EncodingException::class,
        '/quantity/i',
    );
});

test('rejects invalid quantities and missing keys', function () {
    assertThrows(
        static fn () => CompactDeckCodec::encode([
            ['quantity' => 0, 'faction' => 'AX', 'numberInFaction' => 1, 'rarity' => 'C'],
        ]),
        EncodingException::class,
        '/quantity/i',
    );
    assertThrows(
        static fn () => CompactDeckCodec::encode([
            ['quantity' => 1, 'faction' => 'AX', 'rarity' => 'C'],
        ]),
        EncodingException::class,
        '/numberInFaction/',
    );
    assertThrows(
        static fn () => CompactDeckCodec::encode([
            ['quantity' => 1, 'faction' => 'AX', 'numberInFaction' => 7, 'rarity' => 'U'],
        ]),
        EncodingException::class,
        '/uniqueId/',
    );
});

test('entryFromReference parses commons and uniques', function () {
    assertSame(
        ['quantity' => 3, 'faction' => 'LY', 'numberInFaction' => 28, 'rarity' => 'C', 'set' => 'CORE'],
        CompactDeckCodec::entryFromReference('ALT_CORE_B_LY_28_C', 3),
    );
    assertSame(
        ['quantity' => 1, 'faction' => 'AX', 'numberInFaction' => 7, 'rarity' => 'U', 'uniqueId' => 5446, 'set' => 'COREKS'],
        CompactDeckCodec::entryFromReference('ALT_COREKS_B_AX_07_U_5446', 1),
    );
});

test('entryFromReference rejects malformed references', function () {
    assertThrows(
        static fn () => CompactDeckCodec::entryFromReference('not_a_card', 1),
        EncodingException::class,
    );
    assertThrows(
        static fn () => CompactDeckCodec::entryFromReference('ALT_CORE_B_AX_01_U', 1), // unique without ID
        EncodingException::class,
    );
    assertThrows(
        static fn () => CompactDeckCodec::entryFromReference('ALT_CORE_B_QQ_01_C', 1), // unknown faction
        EncodingException::class,
    );
});

test('decode rejects malformed codes', function () {
    assertThrows(static fn () => CompactDeckCodec::decode('!!!'), DecodingException::class);
    // Version nibble 1 (standard format), not 2.
    assertThrows(static fn () => CompactDeckCodec::decode('EAA'), DecodingException::class, '/version/i');
    // Valid header claiming one group, but no group data follows.
    assertThrows(static fn () => CompactDeckCodec::decode('IBA'), DecodingException::class, '/end of data/i');
});

// ---------------------------------------------------------------------------

echo "\n{$GLOBALS['__passed']} passed, {$GLOBALS['__failed']} failed\n";
exit($GLOBALS['__failed'] === 0 ? 0 : 1);
