import {
  describe,
  expect,
  it,
  test,
} from 'vitest'
import {
  encodeListCompact,
  decodeListCompact,
} from '../src'
import * as fs from 'fs'

const realExampleFiles = [
  'test/decklists/real_examples/standard_1.txt',
  'test/decklists/real_examples/standard_2.txt',
  'test/decklists/real_examples/standard_3.txt',
  'test/decklists/real_examples/singleton_1.txt',
  'test/decklists/real_examples/singleton_2.txt',
  'test/decklists/real_examples/sandbox_1.txt',
  'test/decklists/real_examples/sandbox_2.txt',
] as const

const expectedEncodedCompact: Record<(typeof realExampleFiles)[number], string> = {
  'test/decklists/real_examples/standard_1.txt': 'IEAmoAQMINlUah-GGOJmKmOuUGUuemlimGnDB1GoMMWDwSQnH0NKYA',
  'test/decklists/real_examples/standard_2.txt': 'IDBBYlZDNKDhFDFhFyISIhQCQ1QxRmRiXVYMebVgyd3WDIe6YSZDZSBRBR3A',
  'test/decklists/real_examples/standard_3.txt': 'IDBBYlZDNKDhFDFhFyISIhQCQ1QxRmRiXVYMebVgyd3WDIe6YSZDZSBRBR3A',
  'test/decklists/real_examples/singleton_1.txt': 'IFhEAsFRjGcbx7JkyTIBIXiKO48k-VpepEAAGg6GAahwHoiiaKIsjCNo8kCSpOFKVhimSapsnahKKpinKurAsq4ryxNHDIbjGRpNk6W7CGcqyzLk',
  'test/decklists/real_examples/singleton_2.txt': 'IGghA0ZSDEIfkWYIdQYejGQ5EkaR62gaCIKA6DgQhAGAaBqHofmfMJImi4MBKE4UhSlQYBiGKZBkmiah0nQfCAIKhCEouJqyMIyjqQpGQzqaJyoCi4MKyAFC4Tg',
  'test/decklists/real_examples/sandbox_1.txt': 'IGAlQsxFRJRQSrTATCUSUVUYIaBWEmGiRKYiixkw-xMx5SZSaTGUJURUlQWC2HmO6TWZWkw1RfSTSey1S6zFTxUYa6A0BCmDUBEmFCFmFyGWGmHWH2ImJGJmJyKGKWKkBLCMGORQABQySmSyTCTWTiTyUSVWVmV2WmXyYCYWYmZGZWbWdgBeShGkABkg',
  'test/decklists/real_examples/sandbox_2.txt': 'IGAnoMoQoaQqIupGJKJpJzKCKKKMKSqerCI5ABDFDJDREBGxHRLRMxORPxSBXhXxkwkIrJIJMJjJ2J4J8KGQtBhChFBGlHRIhIxPRTBVZWSloJISoUI0Q2JApsKDKOKSqbYxCFDlGBGhGxJRKRORPRPhSxZA',
}

function splitTrimSort(text: string): Array<string> {
  return text.split('\n')
    .map((x) => x.trim())
    .filter((x) => x !== '')
    .sort()
}

function expectEqualLists(actual: string, expected: string) {
  expect(splitTrimSort(actual)).toEqual(splitTrimSort(expected))
}

describe('file-based tests (Compact real examples)', () => {
  test.for(realExampleFiles)('With file %s', (fileName) => {
    const content = fs.readFileSync(fileName, { encoding: 'utf8' })
    const encoded = encodeListCompact(content)
    expect(encoded).toEqual(expectedEncodedCompact[fileName])
    const decoded = decodeListCompact(encoded)

    // Semantic normalization: decode output is the Compact-canonical deck text
    const normalized = decodeListCompact(encodeListCompact(content))
    expectEqualLists(decoded, normalized)

    // Stable round-trip through the codec
    expect(encodeListCompact(decoded)).toEqual(encoded)
  })
})

describe('encoding validations (Compact)', () => {
  it('should throw when encoding an unknown family', () => {
    const list = '1 ALT_CORE_B_AX_999_C'
    expect(() => encodeListCompact(list)).toThrowError(/Unknown family/i)
  })

  it('should fold Exalt to Common on decode', () => {
    const list = '1 ALT_FUGUE_A_AX_138_E'
    const decoded = decodeListCompact(encodeListCompact(list))
    expect(decoded).toContain('ALT_FUGUE_B_AX_138_C')
    expect(decoded).not.toContain('_E')
  })

  it('should preserve CORE vs COREKS for dual-family uniques', () => {
    const coreks = '1 ALT_COREKS_B_AX_07_U_5446'
    const core = '1 ALT_CORE_B_AX_07_U_5446'
    expect(decodeListCompact(encodeListCompact(coreks))).toContain('ALT_COREKS_B_AX_07_U_5446')
    expect(decodeListCompact(encodeListCompact(core))).toContain('ALT_CORE_B_AX_07_U_5446')
    expect(encodeListCompact(coreks)).not.toEqual(encodeListCompact(core))
  })

  it('should merge identical Compact keys and sum quantity', () => {
    const list = '2 ALT_CORE_B_AX_01_C\n1 ALT_CORE_A_AX_01_C'
    const decoded = decodeListCompact(encodeListCompact(list))
    expectEqualLists(decoded, '3 ALT_CORE_B_AX_01_C')
  })

  it('should encode an empty list', () => {
    const empty = encodeListCompact('')
    expect(decodeListCompact(empty)).toEqual('')
    expect(encodeListCompact('')).toEqual(empty)
  })

  it('should filter out zero-quantity lines', () => {
    const list = '1 ALT_CORE_B_YZ_02_C\n0 ALT_CORE_B_AX_11_R1\n3 ALT_CORE_B_LY_28_C'
    const decoded = decodeListCompact(encodeListCompact(list))
    expectEqualLists(decoded, '1 ALT_CORE_B_YZ_02_C\n3 ALT_CORE_B_LY_28_C')
  })
})
