import * as fs from 'fs';

import { encodeList, decodeList } from '../encoder'

const files = [
  "src/test/decklists/list_1offs.txt",
  "src/test/decklists/list_2sets.txt",
  "src/test/decklists/list_uniques.txt",
  "src/test/decklists/list_yzmir.txt",
]

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
  console.log("-----------------------------")
  console.log("- ", list.name)
  console.log(list.contents)

  const encoded = encodeList(list.contents)
  console.log("encoded => ", encoded)
  list.encoded = encoded

  console.log("Decoding back to text format:")
  const decodedText = decodeList(list.encoded)
  console.log(decodedText)
}