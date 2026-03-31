import { describe, expect, test } from 'vitest'
import { encodeList, decodeList } from '../src'
import * as fs from 'fs'
import * as path from 'path'

const generatedDir = path.join(__dirname, 'generated')

function splitTrimSort(text: string): Array<string> {
  return text.split("\n")
    .map((x) => x.trim())
    .filter((x) => x != "")
    .sort()
}

const files = fs.existsSync(generatedDir)
  ? fs.readdirSync(generatedDir).filter(f => f.endsWith('.txt')).sort()
  : []

describe('generated round-trip tests', () => {
  test.for(files)("Round-trip %s", (file) => {
    const content = fs.readFileSync(path.join(generatedDir, file), 'utf8')
    const encoded = encodeList(content)
    const decoded = decodeList(encoded)
    expect(splitTrimSort(decoded)).toEqual(splitTrimSort(content))
  })
})
