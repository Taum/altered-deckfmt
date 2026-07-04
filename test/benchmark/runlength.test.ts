import { describe, it } from "vitest"
import { decodeList, encodeList, encodeListV2, encodeListV3, encodeListV4 } from "../../src/encoder"
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

const naiveEncodeV5 = (decklist: string): string => {
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


describe('benchmark v1 vs. v2 vs. v3 vs. v4 vs. naive v5', () => {
  it('should compare encoding length', () => {
    const lengths: {
      v1: number,
      v2: number,
      v3: number,
      v4: number,
      naive_v5: number,
      uncompressed: number,
      v1_minus_v2: number,
      v1_minus_v3: number,
      v3_minus_v4: number,
    }[] = []
    let d_i = 1;
    for (const decklist of sampleDecklists) {
      console.log(`==================\n#${d_i}`)
      // console.log(`${decklist}`)
      const encoded_v1 = encodeList(decklist)
      const encoded_v2 = encodeListV2(decklist)
      const encoded_v3 = encodeListV3(decklist)
      const encoded_v4 = encodeListV4(fixDecklist(decklist))
      const encoded_naive_v5 = naiveEncodeV5(fixDecklist(decklist))

      console.log(
        `v1 (${encoded_v1.length}): ${encoded_v1}\n` +
        `v2 (${encoded_v2.length}): ${encoded_v2}\n` +
        `v3 (${encoded_v3.length}): ${encoded_v3}\n` +
        `v4 (${encoded_v4.length}): ${encoded_v4}\n` +
        `naive v5 (${encoded_naive_v5.length}): ${encoded_naive_v5}`,
        `uncompressed: ${decklist.trim().length}`,
      )
      lengths.push({
        v1: encoded_v1.length,
        v2: encoded_v2.length,
        v3: encoded_v3.length,
        v4: encoded_v4.length,
        naive_v5: encoded_naive_v5.length,
        uncompressed: decklist.trim().length,
        v1_minus_v2: encoded_v1.length - encoded_v2.length,
        v1_minus_v3: encoded_v1.length - encoded_v3.length,
        v3_minus_v4: encoded_v3.length - encoded_v4.length,
      })
      d_i++;
    }

    const lengths_v1 = lengths.map(x => x.v1).sort((a, b) => a - b)
    const lengths_v2 = lengths.map(x => x.v2).sort((a, b) => a - b)
    const lengths_v3 = lengths.map(x => x.v3).sort((a, b) => a - b)
    const lengths_v4 = lengths.map(x => x.v4).sort((a, b) => a - b)
    const lengths_naive_v5 = lengths.map(x => x.naive_v5).sort((a, b) => a - b)
    const lengths_uncompressed = lengths.map(x => x.uncompressed).sort((a, b) => a - b)
    const lengths_diff_v1_v2 = lengths.map(x => x.v1_minus_v2).sort((a, b) => a - b)
    const lengths_diff_v1_v3 = lengths.map(x => x.v1_minus_v3).sort((a, b) => a - b)
    const v1_avg = lengths_v1.reduce((a, b) => a + b, 0) / lengths_v1.length
    const v2_avg = lengths_v2.reduce((a, b) => a + b, 0) / lengths_v2.length
    const v3_avg = lengths_v3.reduce((a, b) => a + b, 0) / lengths_v3.length
    const v4_avg = lengths_v4.reduce((a, b) => a + b, 0) / lengths_v4.length
    const naive_v5_avg = lengths_naive_v5.reduce((a, b) => a + b, 0) / lengths_naive_v5.length
    const uncompressed_avg = lengths_uncompressed.reduce((a, b) => a + b, 0) / lengths_uncompressed.length
    const v1_p50 = lengths_v1[Math.floor(lengths_v1.length * 0.5)]
    const v2_p50 = lengths_v2[Math.floor(lengths_v2.length * 0.5)]
    const v3_p50 = lengths_v3[Math.floor(lengths_v3.length * 0.5)]
    const v4_p50 = lengths_v4[Math.floor(lengths_v4.length * 0.5)]
    const naive_v5_p50 = lengths_naive_v5[Math.floor(lengths_naive_v5.length * 0.5)]
    const uncompressed_p50 = lengths_uncompressed[Math.floor(lengths_uncompressed.length * 0.5)]
    const v1_p75 = lengths_v1[Math.floor(lengths_v1.length * 0.75)]
    const v2_p75 = lengths_v2[Math.floor(lengths_v2.length * 0.75)]
    const v3_p75 = lengths_v3[Math.floor(lengths_v3.length * 0.75)]
    const v4_p75 = lengths_v4[Math.floor(lengths_v4.length * 0.75)]
    const naive_v5_p75 = lengths_naive_v5[Math.floor(lengths_naive_v5.length * 0.75)]
    const uncompressed_p75 = lengths_uncompressed[Math.floor(lengths_uncompressed.length * 0.75)]
    const v1_p90 = lengths_v1[Math.floor(lengths_v1.length * 0.9)]
    const v2_p90 = lengths_v2[Math.floor(lengths_v2.length * 0.9)]
    const v3_p90 = lengths_v3[Math.floor(lengths_v3.length * 0.9)]
    const v4_p90 = lengths_v4[Math.floor(lengths_v4.length * 0.9)]
    const naive_v5_p90 = lengths_naive_v5[Math.floor(lengths_naive_v5.length * 0.9)]
    const uncompressed_p90 = lengths_uncompressed[Math.floor(lengths_uncompressed.length * 0.9)]
    const v1_max = lengths_v1[lengths_v1.length - 1]
    const v2_max = lengths_v2[lengths_v2.length - 1]
    const v3_max = lengths_v3[lengths_v3.length - 1]
    const v4_max = lengths_v4[lengths_v4.length - 1]
    const naive_v5_max = lengths_naive_v5[lengths_naive_v5.length - 1]
    const uncompressed_max = lengths_uncompressed[lengths_uncompressed.length - 1]

    const diff_freqs_v1_v2 = lengths_diff_v1_v2.reduce((acc, diff) => {
      acc[diff] = (acc[diff] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    const diff_freqs_v1_v3 = lengths_diff_v1_v3.reduce((acc, diff) => {
      acc[diff] = (acc[diff] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    console.table({
      uncompressed: {
        avg: Math.round(uncompressed_avg * 10) / 10,
        p50: uncompressed_p50,
        p75: uncompressed_p75,
        p90: uncompressed_p90,
        max: uncompressed_max,
      },
      'naive': {
        avg: Math.round(naive_v5_avg * 10) / 10,
        p50: naive_v5_p50,
        p75: naive_v5_p75,
        p90: naive_v5_p90,
        max: naive_v5_max,
      },
      v1: {
        avg: Math.round(v1_avg * 10) / 10,
        p50: v1_p50,
        p75: v1_p75,
        p90: v1_p90,
        max: v1_max,
      },
      // v2: {
      //   avg: Math.round(v2_avg * 10) / 10,
      //   p50: v2_p50,
      //   p75: v2_p75,
      //   p90: v2_p90,
      //   max: v2_max,
      // },
      // v3: {
      //   avg: Math.round(v3_avg * 10) / 10,
      //   p50: v3_p50,
      //   p75: v3_p75,
      //   p90: v3_p90,
      //   max: v3_max,
      // },
      v2: {
        avg: Math.round(v4_avg * 10) / 10,
        p50: v4_p50,
        p75: v4_p75,
        p90: v4_p90,
        max: v4_max,
      },
    })
    // console.table(
    //   Object.entries(diff_freqs_v1_v2)
    //     .map(([diff, count]) => ({ diff: parseInt(diff), count }))
    //     .sort((a, b) => a.diff - b.diff),
    //   ['diff', 'count'],
    // )
    // console.table(
    //   Object.entries(diff_freqs_v1_v3)
    //     .map(([diff, count]) => ({ diff: parseInt(diff), count }))
    //     .sort((a, b) => a.diff - b.diff),
    //   ['diff', 'count'],
    // )
  })
})