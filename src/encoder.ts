import { EncodableDeck } from './syntax'
import { CardRefQty } from './models'

import { BufferedWritable, BitstreamWriter, BitstreamReader } from './bitstream'
import { Buffer } from 'buffer'

export function encodeList(list: string): string {
  const lines = list.split("\n")
  const cards: Array<CardRefQty> = lines.flatMap((ln) => {
    const match = ln.trim().match(/^(\d+) (\w+)$/)
    if (match) {
      const quantity = parseInt(match[1], 10)
      if (quantity > 0) {
        return [{quantity: parseInt(match[1], 10), id: match[2]}]
      }
    }
    return []
  })

  const bufWriteable = new BufferedWritable()
  const writer = new BitstreamWriter(bufWriteable, 1024)

  const deck = EncodableDeck.fromList(cards)
  deck.encode(writer)
  writer.end()

  return Buffer.concat([bufWriteable.buffer]).toString('base64url')
}

export function decodeList(encoded: string): string {
  const bytes = Buffer.from(encoded, 'base64url');
  let reader = new BitstreamReader();
  reader.addBuffer(bytes)
  const deck = EncodableDeck.decode(reader)
  const text = deck.asCardRefQty.map((cq) => `${cq.quantity} ${cq.id}`).join("\n")
  return text
}
