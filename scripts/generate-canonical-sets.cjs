/**
 * Generate src/canonical_sets.ts from equinox-cards non-unique folder structure.
 * Usage: node scripts/generate-canonical-sets.cjs [path/to/cards-nonunique/json]
 */
const fs = require('fs')
const path = require('path')

const defaultRoot = path.join(
  __dirname,
  '..',
  '..',
  'equinox-cards',
  'cards-nonunique',
  'json',
)
const jsonRoot = process.argv[2] ?? defaultRoot

const factionToId = { AX: 1, BR: 2, LY: 3, MU: 4, OR: 5, YZ: 6, NE: 7 }

/** Map physical set folders to one of the seven canonical sets. */
const TO_CANONICAL = {
  CORE: 'CORE',
  COREKS: 'CORE',
  ALIZE: 'ALIZE',
  BISE: 'BISE',
  CYCLONE: 'CYCLONE',
  DUSTER: 'DUSTER',
  DUSTERTOP: 'DUSTER',
  DUSTERCB: 'DUSTER',
  DUSTEROP: 'DUSTER',
  EOLE: 'EOLE',
  EOLECB: 'EOLE',
  FUGUE: 'FUGUE',
  TCS3: 'BISE',
  WCQ25: 'CORE',
  WCS25: 'CORE',
  WCF25: 'CORE',
  WCS26: 'EOLE',
  MUSUBI: 'CYCLONE',
  JUDGE: 'CORE',
}

const CANONICAL_SET_NAMES = ['CORE', 'ALIZE', 'BISE', 'CYCLONE', 'DUSTER', 'EOLE', 'FUGUE']
const canonRank = Object.fromEntries(CANONICAL_SET_NAMES.map((s, i) => [s, i]))

/** @type {Map<string, { sourceSets: Set<string>, canonicalSets: Set<string> }>} */
const byFamily = new Map()

for (const setName of fs.readdirSync(jsonRoot)) {
  const setDir = path.join(jsonRoot, setName)
  if (!fs.statSync(setDir).isDirectory()) {
    continue
  }
  const mappedCanonical = TO_CANONICAL[setName]
  if (!mappedCanonical) {
    console.warn(`Skipping unmapped set folder: ${setName}`)
    continue
  }

  for (const faction of fs.readdirSync(setDir)) {
    if (!factionToId[faction]) {
      continue
    }
    const facDir = path.join(setDir, faction)
    if (!fs.statSync(facDir).isDirectory()) {
      continue
    }
    for (const nifStr of fs.readdirSync(facDir)) {
      const nif = parseInt(nifStr, 10)
      if (Number.isNaN(nif)) {
        continue
      }
      const fid = factionToId[faction]
      const key = `${fid}:${nif}`
      if (!byFamily.has(key)) {
        byFamily.set(key, { sourceSets: new Set(), canonicalSets: new Set() })
      }
      const entry = byFamily.get(key)
      entry.sourceSets.add(setName)
      entry.canonicalSets.add(mappedCanonical)
    }
  }
}

const rows = []
for (const [key, { sourceSets, canonicalSets }] of byFamily) {
  const [fidStr, nifStr] = key.split(':')
  const fid = parseInt(fidStr, 10)
  const nif = parseInt(nifStr, 10)
  const dualCoreCoreks = sourceSets.has('CORE') && sourceSets.has('COREKS')

  let canonicalSet = null
  let bestRank = Number.POSITIVE_INFINITY
  for (const canonical of canonicalSets) {
    const rank = canonRank[canonical]
    if (rank < bestRank) {
      bestRank = rank
      canonicalSet = canonical
    }
  }
  if (!canonicalSet) {
    throw new Error(`No canonical set for family ${key}`)
  }

  rows.push({ fid, nif, canonicalSet, dualCoreCoreks: dualCoreCoreks ? 1 : 0 })
}

/** @type {Array<{ setName: string, dualCoreCoreks: 0 | 1, ranges: Array<[number, number, number]>, familyCount: number }>} */
const rangesBySet = []

for (const setName of CANONICAL_SET_NAMES) {
  const setRows = rows
    .filter((row) => row.canonicalSet === setName)
    .sort((a, b) => a.fid - b.fid || a.nif - b.nif)

  const dualValues = new Set(setRows.map((row) => row.dualCoreCoreks))
  if (dualValues.size > 1) {
    throw new Error(`Mixed dualCoreCoreks within canonical set ${setName}`)
  }
  const dualCoreCoreks = setRows.length > 0 ? setRows[0].dualCoreCoreks : 0

  /** @type {Array<[number, number, number]>} */
  const ranges = []
  for (const row of setRows) {
    const last = ranges[ranges.length - 1]
    if (last && last[0] === row.fid && row.nif === last[2] + 1) {
      last[2] = row.nif
    } else {
      ranges.push([row.fid, row.nif, row.nif])
    }
  }

  rangesBySet.push({
    setName,
    dualCoreCoreks,
    ranges,
    familyCount: setRows.length,
  })
}

const totalFamilies = rows.length
const totalRanges = rangesBySet.reduce((sum, group) => sum + group.ranges.length, 0)

let violations = 0
for (const setName of fs.readdirSync(jsonRoot)) {
  const mappedCanonical = TO_CANONICAL[setName]
  if (!mappedCanonical) {
    continue
  }
  const setDir = path.join(jsonRoot, setName)
  if (!fs.statSync(setDir).isDirectory()) {
    continue
  }
  for (const faction of fs.readdirSync(setDir)) {
    if (!factionToId[faction]) {
      continue
    }
    const facDir = path.join(setDir, faction)
    if (!fs.statSync(facDir).isDirectory()) {
      continue
    }
    for (const nifStr of fs.readdirSync(facDir)) {
      const nif = parseInt(nifStr, 10)
      if (Number.isNaN(nif)) {
        continue
      }
      const fid = factionToId[faction]
      const row = rows.find((r) => r.fid === fid && r.nif === nif)
      if (!row) {
        violations++
        continue
      }
      const canonicalSets = byFamily.get(`${fid}:${nif}`).canonicalSets
      if (!canonicalSets.has(mappedCanonical)) {
        violations++
      }
    }
  }
}
if (violations > 0) {
  throw new Error(`${violations} cards fall outside canonical set mapping`)
}

function formatRangesBySet(groups) {
  const lines = ['[']
  for (const group of groups) {
    lines.push(`  // ${group.setName} — ${group.familyCount} families, ${group.ranges.length} ranges`)
    lines.push(`  { dualCoreCoreks: ${group.dualCoreCoreks}, ranges: ${JSON.stringify(group.ranges)} },`)
  }
  lines.push(']')
  return lines.join('\n')
}

const outPath = path.join(__dirname, '..', 'src', 'canonical_sets.ts')
const body = `// Generated from equinox-cards cards-nonunique folder structure — do not edit by hand
// Run: node scripts/generate-canonical-sets.cjs
// ${totalFamilies} families; ${totalRanges} nif ranges across ${CANONICAL_SET_NAMES.length} canonical sets

export interface FamilyMeta {
  canonicalSet: string
  dualCoreCoreks: boolean
}

export const CANONICAL_SET_NAMES = ${JSON.stringify(CANONICAL_SET_NAMES)} as const

/** Per canonical set: dual CORE/COREKS flag and [factionId, minNif, maxNif] ranges (grouped by set). */
export const FAMILY_RANGES_BY_SET: readonly {
  dualCoreCoreks: 0 | 1
  ranges: readonly (readonly [number, number, number])[]
}[] = ${formatRangesBySet(rangesBySet)}

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
`

fs.writeFileSync(outPath, body)
console.log(
  `Wrote ${totalFamilies} families, ${totalRanges} ranges in ${CANONICAL_SET_NAMES.length} set groups to ${outPath}`,
)
