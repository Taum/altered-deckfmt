import * as fs from 'fs';

import { encodeList, decodeList } from '../encoder'

// Use this to debug test
const verbose = false
globalThis.BITSTREAM_TRACE = false

const files = [
  "src/test/decklists/test_mana_orb.txt",
  "src/test/decklists/test_long_uniq.txt",
  "src/test/decklists/test_extd_qty.txt",
  "src/test/decklists/list_1offs.txt",
  "src/test/decklists/list_2sets.txt",
  "src/test/decklists/list_uniques.txt",
  "src/test/decklists/list_yzmir.txt",
]


function splitTrimSort(text) {
  return text.split("\n")
    .map((x) => x.trim())
    .filter((x) => x != "")
    .sort()
}
function verifyEqualLists(actual, expected) {
  const actualArr = splitTrimSort(actual)
  const expectedArr = splitTrimSort(expected)
  if (actualArr.length != expectedArr.length) { 
    console.log(`Length mismatch ${actualArr.length} != ${expectedArr.length}`);
    return false
  }
  for (let i = 0 ; i < actualArr.length ; i++) {
    if (actualArr[i] != expectedArr[i]) {
      console.log(`Item[${i}] ${actualArr[i]} != ${expectedArr[i]}`);
      return false
    }
  }
  return true
}

interface Example {
  name: string
  contents: string
  encoded?: string
}

let exampleLists = Array<Example>()
for (let file of files) {
  exampleLists.push({
    name: file,
    contents: fs.readFileSync(file, { encoding: 'utf8' }),
    encoded: undefined
  })
}

for (let list of exampleLists) {
  if (verbose) console.log("-----------------------------")
  console.log("- ", list.name)
  if (verbose) console.log(list.contents)

  const encoded = encodeList(list.contents)
  if (verbose) console.log("encoded => ", encoded)
  list.encoded = encoded

  if (verbose) console.log("Decoding back to text format:")
  const decodedText = decodeList(list.encoded)
  if (verbose) console.log(decodedText)

  if (!verifyEqualLists(decodedText, list.contents)) {
    console.log("    FAILED")
    console.log("Encoded:", encoded)
  } else {
    console.log("    PASS")
  }
}