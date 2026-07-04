export interface FamilyMeta {
    canonicalSet: string;
    dualCoreCoreks: boolean;
}
export declare const CANONICAL_SET_NAMES: readonly ["CORE", "ALIZE", "BISE", "CYCLONE", "DUSTER", "EOLE", "FUGUE"];
/** Per canonical set: dual CORE/COREKS flag and [factionId, minNif, maxNif] ranges (grouped by set). */
export declare const FAMILY_RANGES_BY_SET: readonly {
    dualCoreCoreks: 0 | 1;
    ranges: readonly (readonly [number, number, number])[];
}[];
export declare function getFamilyMeta(factionId: number, nif: number): FamilyMeta | undefined;
export declare function isDualCoreCoreks(factionId: number, nif: number): boolean;
export declare function getCanonicalSet(factionId: number, nif: number): string | undefined;
