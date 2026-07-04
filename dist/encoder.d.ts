/** Encode a decklist using the standard (lossless) binary format. */
export declare function encodeList(list: string): string;
/** Decode a decklist produced by {@link encodeList}. */
export declare function decodeList(encoded: string): string;
/**
 * Encode a decklist using the Compact format.
 *
 * The Compact format is smaller than the standard format but lossy: it does
 * not preserve Alternate/Promo variants and normalizes the Set of each card
 * (see FORMAT_SPEC_COMPACT.md).
 */
export declare function encodeListCompact(list: string): string;
/** Decode a decklist produced by {@link encodeListCompact}. */
export declare function decodeListCompact(encoded: string): string;
