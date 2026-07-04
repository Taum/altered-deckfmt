import { describe, it } from "vitest"
import { decodeList, encodeList, encodeListCompact } from "../../src/encoder"
import { CardRefElements, RefRarity } from "../../src/models"
import * as fs from 'fs'

const sampleTextFile = fs.readFileSync('test/benchmark/sample_decklists.txt', 'utf8')

const sampleDecklists = sampleTextFile
  .split('\n')
  .map(line => line.trim().replace('"', ''))
  .filter(line => line !== '' && line !== 'deckCode' && !line.startsWith('#'))
  .map(line => decodeList(line))

const fixDecklist = (decklist: string) => {
  return decklist.replace(/ALT_BISE_P_BR_00/, 'ALT_BISE_P_BR_64')
}

const FACTION_LETTER: Record<string, string> = {
  AX: 'A',
  BR: 'B',
  LY: 'L',
  MU: 'M',
  OR: 'O',
  YZ: 'Y',
  NE: 'N',
}

const RARITY_LETTER: Record<string, string> = {
  C: 'C',
  R1: 'R',
  R2: 'F',
  E: 'E',
  U: 'U',
}

// Naive text baseline: one token per card line, no bit-packing.
const naiveEncode = (decklist: string): string => {
  return decklist.split('\n').flatMap((ln) => {
    const match = ln.trim().match(/^(\d+) (\w+)$/)
    if (!match) {
      return []
    }
    const quantity = parseInt(match[1], 10)
    if (quantity <= 0) {
      return []
    }
    const ref = new CardRefElements(match[2])
    let entry = `${quantity}${FACTION_LETTER[ref.faction]}${ref.num_in_faction}${RARITY_LETTER[ref.rarity]}`
    if (ref.rarity === RefRarity.Unique) {
      entry += `${ref.uniq_num};`
    }
    return [entry]
  }).join('')
}

function percentiles(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length
  return {
    avg: Math.round(avg * 10) / 10,
    p50: sorted[Math.floor(sorted.length * 0.5)],
    p75: sorted[Math.floor(sorted.length * 0.75)],
    p90: sorted[Math.floor(sorted.length * 0.9)],
    max: sorted[sorted.length - 1],
  }
}

describe('benchmark: standard vs. compact', () => {
  it('should compare encoding length', () => {
    const lengths: {
      standard: number,
      compact: number,
      naive: number,
      uncompressed: number,
    }[] = []
    let d_i = 1;
    for (const decklist of sampleDecklists) {
      console.log(`==================\n#${d_i}`)
      const encoded_standard = encodeList(decklist)
      const encoded_compact = encodeListCompact(fixDecklist(decklist))
      const encoded_naive = naiveEncode(fixDecklist(decklist))

      console.log(
        `standard (${encoded_standard.length}): ${encoded_standard}\n` +
        `compact  (${encoded_compact.length}): ${encoded_compact}\n` +
        `naive    (${encoded_naive.length}): ${encoded_naive}`,
        `uncompressed: ${decklist.trim().length}`,
      )
      lengths.push({
        standard: encoded_standard.length,
        compact: encoded_compact.length,
        naive: encoded_naive.length,
        uncompressed: decklist.trim().length,
      })
      d_i++;
    }

    console.table({
      uncompressed: percentiles(lengths.map(x => x.uncompressed)),
      naive: percentiles(lengths.map(x => x.naive)),
      standard: percentiles(lengths.map(x => x.standard)),
      compact: percentiles(lengths.map(x => x.compact)),
    })
  })
})
