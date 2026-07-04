/**
 * Generate src/canonical_sets.ts from rust-cards-api catalog.json
 * Usage: node scripts/generate-canonical-sets.js [path/to/catalog.json]
 */
const fs = require('fs')
const path = require('path')

const defaultCatalog = path.join(
  __dirname,
  '..',
  '..',
  'rust-cards-api',
  'build',
  'full_index',
  'ALL_SETS',
  'catalog.json',
)
const catalogPath = process.argv[2] ?? defaultCatalog

const cat = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
const factionToId = { AX: 1, BR: 2, LY: 3, MU: 4, OR: 5, YZ: 6, NE: 7 }
const setOrder = [
  'COREKS', 'CORE', 'ALIZE', 'BISE', 'TCS3', 'WCQ25', 'WCS25',
  'CYCLONE', 'DUSTER', 'DUSTERTOP', 'DUSTERCB', 'DUSTEROP', 'EOLE', 'FUGUE',
]
const setRank = Object.fromEntries(setOrder.map((s, i) => [s, i]))

const byFamily = new Map()
for (const f of cat.families) {
  const nif = parseInt(f.family_number, 10)
  const fid = factionToId[f.faction]
  const key = `${fid}:${nif}`
  if (!byFamily.has(key)) {
    byFamily.set(key, { sets: new Set() })
  }
  byFamily.get(key).sets.add(f.source_set)
}

const rows = []
for (const [key, { sets }] of byFamily) {
  const [fidStr, nifStr] = key.split(':')
  const fid = parseInt(fidStr, 10)
  const nif = parseInt(nifStr, 10)
  const dual = sets.has('CORE') && sets.has('COREKS')
  let canonical
  if (dual) {
    canonical = 'CORE'
  } else {
    let best = -1
    let bestSet = null
    for (const s of sets) {
      const r = setRank[s] ?? -1
      if (r >= best) {
        best = r
        bestSet = s
      }
    }
    canonical = bestSet
  }
  rows.push([fid, nif, canonical, dual ? 1 : 0])
}
rows.sort((a, b) => a[0] - b[0] || a[1] - b[1])

const outPath = path.join(__dirname, '..', 'src', 'canonical_sets.ts')
const body = `// Generated from ${path.basename(catalogPath)} — do not edit by hand
// Run: node scripts/generate-canonical-sets.js

export interface FamilyMeta {
  canonicalSet: string
  dualCoreCoreks: boolean
}

type FamilyRow = readonly [factionId: number, nif: number, canonicalSet: string, dualCoreCoreks: 0 | 1]

const FAMILY_ROWS: readonly FamilyRow[] = ${JSON.stringify(rows, null, 2)}

const familyMetaMap = new Map<string, FamilyMeta>()
for (const [factionId, nif, canonicalSet, dualCoreCoreks] of FAMILY_ROWS) {
  familyMetaMap.set(familyKey(factionId, nif), {
    canonicalSet,
    dualCoreCoreks: dualCoreCoreks === 1,
  })
}

function familyKey(factionId: number, nif: number): string {
  return \`\${factionId}:\${nif}\`
}

export function getFamilyMeta(factionId: number, nif: number): FamilyMeta | undefined {
  return familyMetaMap.get(familyKey(factionId, nif))
}

export function isDualCoreCoreks(factionId: number, nif: number): boolean {
  return getFamilyMeta(factionId, nif)?.dualCoreCoreks ?? false
}

export function getCanonicalSet(factionId: number, nif: number): string | undefined {
  return getFamilyMeta(factionId, nif)?.canonicalSet
}
`

fs.writeFileSync(outPath, body)
console.log(`Wrote ${rows.length} families to ${outPath}`)
