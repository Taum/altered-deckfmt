import { describe, it } from "vitest"
import { decodeList, encodeList, encodeListV2, encodeListV3 } from "../../src/encoder"
import * as fs from 'fs'

const sampleTextFile = fs.readFileSync('test/benchmark/sample_decklists.txt', 'utf8')

const sampleDecklists = sampleTextFile
  .split('\n')
  .map(line => line.trim().replace('"', ''))
  .filter(line => line !== '' && line !== 'deckCode' && !line.startsWith('#'))
  .map(line => decodeList(line))



describe('benchmark v1 vs. v2', () => {
  it('should compare encoding length', () => {
    const lengths: {
      v1: number,
      v2: number,
      v3: number,
      v1_minus_v2: number,
      v1_minus_v3: number,
    }[] = []
    let d_i = 1;
    for (const decklist of sampleDecklists) {
      console.log(`==================\n#${d_i}`)
      // console.log(`${decklist}`)
      const encoded_v1 = encodeList(decklist)
      const encoded_v2 = encodeListV2(decklist)
      const encoded_v3 = encodeListV3(decklist)
      console.log(
        `v1 (${encoded_v1.length}): ${encoded_v1}\n` +
        `v2 (${encoded_v2.length}): ${encoded_v2}\n` +
        `v3 (${encoded_v3.length}): ${encoded_v3}`,
      )
      lengths.push({
        v1: encoded_v1.length,
        v2: encoded_v2.length,
        v3: encoded_v3.length,
        v1_minus_v2: encoded_v1.length - encoded_v2.length,
        v1_minus_v3: encoded_v1.length - encoded_v3.length,
      })
      d_i++;
    }

    const lengths_v1 = lengths.map(x => x.v1).sort((a, b) => a - b)
    const lengths_v2 = lengths.map(x => x.v2).sort((a, b) => a - b)
    const lengths_v3 = lengths.map(x => x.v3).sort((a, b) => a - b)
    const lengths_diff_v1_v2 = lengths.map(x => x.v1_minus_v2).sort((a, b) => a - b)
    const lengths_diff_v1_v3 = lengths.map(x => x.v1_minus_v3).sort((a, b) => a - b)
    const v1_avg = lengths_v1.reduce((a, b) => a + b, 0) / lengths_v1.length
    const v2_avg = lengths_v2.reduce((a, b) => a + b, 0) / lengths_v2.length
    const v3_avg = lengths_v3.reduce((a, b) => a + b, 0) / lengths_v3.length
    const v1_p50 = lengths_v1[Math.floor(lengths_v1.length * 0.5)]
    const v2_p50 = lengths_v2[Math.floor(lengths_v2.length * 0.5)]
    const v3_p50 = lengths_v3[Math.floor(lengths_v3.length * 0.5)]
    const v1_p75 = lengths_v1[Math.floor(lengths_v1.length * 0.75)]
    const v2_p75 = lengths_v2[Math.floor(lengths_v2.length * 0.75)]
    const v3_p75 = lengths_v3[Math.floor(lengths_v3.length * 0.75)]
    const v1_p90 = lengths_v1[Math.floor(lengths_v1.length * 0.9)]
    const v2_p90 = lengths_v2[Math.floor(lengths_v2.length * 0.9)]
    const v3_p90 = lengths_v3[Math.floor(lengths_v3.length * 0.9)]
    const v1_max = lengths_v1[lengths_v1.length - 1]
    const v2_max = lengths_v2[lengths_v2.length - 1]
    const v3_max = lengths_v3[lengths_v3.length - 1]

    const diff_freqs_v1_v2 = lengths_diff_v1_v2.reduce((acc, diff) => {
      acc[diff] = (acc[diff] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    const diff_freqs_v1_v3 = lengths_diff_v1_v3.reduce((acc, diff) => {
      acc[diff] = (acc[diff] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    console.table({
      v1: {
        avg: Math.round(v1_avg * 10) / 10,
        p50: v1_p50,
        p75: v1_p75,
        p90: v1_p90,
        max: v1_max,
      },
      v2: {
        avg: Math.round(v2_avg * 10) / 10,
        p50: v2_p50,
        p75: v2_p75,
        p90: v2_p90,
        max: v2_max,
      },
      v3: {
        avg: Math.round(v3_avg * 10) / 10,
        p50: v3_p50,
        p75: v3_p75,
        p90: v3_p90,
        max: v3_max,
      },
    })
    console.table(
      Object.entries(diff_freqs_v1_v2)
        .map(([diff, count]) => ({ diff: parseInt(diff), count }))
        .sort((a, b) => a.diff - b.diff),
      ['diff', 'count'],
    )
    console.table(
      Object.entries(diff_freqs_v1_v3)
        .map(([diff, count]) => ({ diff: parseInt(diff), count }))
        .sort((a, b) => a.diff - b.diff),
      ['diff', 'count'],
    )
  })
})