// Generated from equinox-cards cards-nonunique folder structure — do not edit by hand
// Run: node scripts/generate-canonical-sets.cjs
// 808 families; 46 nif ranges across 7 canonical sets

export interface FamilyMeta {
  canonicalSet: string
  dualCoreCoreks: boolean
}

export const CANONICAL_SET_NAMES = ["CORE","ALIZE","BISE","CYCLONE","DUSTER","EOLE","FUGUE"] as const

/** Per canonical set: dual CORE/COREKS flag and [factionId, minNif, maxNif] ranges (grouped by set). */
export const FAMILY_RANGES_BY_SET: readonly {
  dualCoreCoreks: 0 | 1
  ranges: readonly (readonly [number, number, number])[]
}[] = [
  // CORE — 187 families, 7 ranges
  { dualCoreCoreks: 1, ranges: [[1,1,31],[2,1,31],[3,1,30],[4,1,30],[5,1,32],[6,1,31],[7,0,1]] },
  // ALIZE — 93 families, 7 ranges
  { dualCoreCoreks: 0, ranges: [[1,32,46],[2,32,46],[3,31,45],[4,31,45],[5,33,48],[6,32,47],[7,2,2]] },
  // BISE — 91 families, 6 ranges
  { dualCoreCoreks: 0, ranges: [[1,49,63],[2,49,64],[3,49,63],[4,49,63],[5,49,63],[6,49,63]] },
  // CYCLONE — 111 families, 7 ranges
  { dualCoreCoreks: 0, ranges: [[1,65,82],[2,65,83],[3,65,82],[4,65,83],[5,65,82],[6,65,82],[7,3,3]] },
  // DUSTER — 106 families, 7 ranges
  { dualCoreCoreks: 0, ranges: [[1,85,102],[2,86,102],[3,86,102],[4,85,102],[5,85,102],[6,86,102],[7,4,4]] },
  // EOLE — 106 families, 6 ranges
  { dualCoreCoreks: 0, ranges: [[1,106,122],[2,105,123],[3,105,122],[4,106,122],[5,106,122],[6,105,122]] },
  // FUGUE — 114 families, 6 ranges
  { dualCoreCoreks: 0, ranges: [[1,130,148],[2,130,148],[3,130,148],[4,130,148],[5,130,148],[6,130,148]] },
]

export function getFamilyMeta(factionId: number, nif: number): FamilyMeta | undefined {
  for (let setId = 0; setId < CANONICAL_SET_NAMES.length; setId++) {
    const { dualCoreCoreks, ranges } = FAMILY_RANGES_BY_SET[setId]
    for (const [fid, minNif, maxNif] of ranges) {
      if (factionId === fid && nif >= minNif && nif <= maxNif) {
        return {
          canonicalSet: CANONICAL_SET_NAMES[setId],
          dualCoreCoreks: dualCoreCoreks === 1,
        }
      }
    }
  }
  return undefined
}

export function isDualCoreCoreks(factionId: number, nif: number): boolean {
  return getFamilyMeta(factionId, nif)?.dualCoreCoreks ?? false
}

export function getCanonicalSet(factionId: number, nif: number): string | undefined {
  return getFamilyMeta(factionId, nif)?.canonicalSet
}
