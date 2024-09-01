import {
  describe,
  expect,
  it,
  test,
} from 'vitest'
import { encodeList, decodeList } from '../src'
import * as fs from 'fs'

const files = [
  "test/decklists/test_mana_orb.txt",
  "test/decklists/test_long_uniq.txt",
  "test/decklists/test_extd_qty.txt",
  "test/decklists/test_products.txt",
  "test/decklists/list_1offs.txt",
  "test/decklists/list_2sets.txt",
  "test/decklists/list_uniques.txt",
  "test/decklists/list_yzmir.txt",
]
const expectedEncoded = {
  "test/decklists/test_mana_orb.txt": "EBAg3hHfC8IA",
  "test/decklists/test_long_uniq.txt": "EBARGz4JpNnycPbPmBy2f//8",
  "test/decklists/test_extd_qty.txt": "EBAgTTMo",
  "test/decklists/test_products.txt": "EBAg04RrTJLU",
  "test/decklists/list_1offs.txt": "ECAU2RjKFlBScpaUlWVLJFkwysZc0wLFzMh2NTYZw0+GfIEXS4ZWtOmYNMRmyzgp6N+mcjOU",
  "test/decklists/list_2sets.txt": "ECAjGhnSHpR0s6gdRaqPWRrRVp64deQESnV0UqcdPA==", 
  "test/decklists/list_uniques.txt": "EBAVnBjhHww4lcSeILFNjDx5S+so2TPLDRcOHGX4iUOcWt1XazI5t8wW8g==",
  "test/decklists/list_yzmir.txt": "EBAk3hnUK4h8daVOIvjFyx5h846zfTGuXmb6p9YuwPaHsgA=",
}

function splitTrimSort(text: string): Array<string> {
  return text.split("\n")
    .map((x) => x.trim())
    .filter((x) => x != "")
    .sort()
}

function expectEqualLists(actual, expected) {
  const actualArr = splitTrimSort(actual)
  const expectedArr = splitTrimSort(expected)
  expect(actualArr).toEqual(expectedArr)
}

describe('file-based tests', () => {
  test.for(files)("With file '%s'", (fileName) => {
    const content = fs.readFileSync(fileName, { encoding: 'utf8' })
    const encoded = encodeList(content)
    expect(encoded).toEqual(expectedEncoded[fileName])
    const decoded = decodeList(encoded)
    expectEqualLists(decoded, content)
  })
})

describe('encoding validations', () => {
  it('should throw an error when trying to encode uniques beyond 16 bit bounds', () => {
    const list = "1 ALT_COREKS_B_LY_07_U_123456"
    expect(() => encodeList(list)).toThrowError(/Unique ID/i)
  })
  
  it('should throw an error when trying to encode more than 65 of the same card', () => {
    const list = "66 ALT_CORE_B_AX_11_R1"
    expect(() => encodeList(list)).toThrowError(/quantity/i)
  })
  
  it('should filter out cards with a quantity of 0', () => {
    const list = "1 ALT_CORE_B_YZ_02_C\n0 ALT_CORE_B_AX_11_R1\n3 ALT_CORE_B_LY_28_C\n"
    const listWithoutZero = "1 ALT_CORE_B_YZ_02_C\n3 ALT_CORE_B_LY_28_C"
    const encoded = encodeList(list)
    const decoded = decodeList(encoded)
    expectEqualLists(decoded, listWithoutZero)
  })

  it ('should encode an empty list', () => {
    const empty = encodeList("")
    expect(empty).toEqual("EAA=")
    const decoded = decodeList(empty)
    expect(decoded).toEqual("")
  })
})