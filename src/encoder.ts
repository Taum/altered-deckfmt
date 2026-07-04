import { EncodableDeck as EncodableDeckV1 } from './syntax_v1'
import { EncodableDeck as EncodableDeckV2 } from './syntax_v2'
import { EncodableDeck as EncodableDeckV3 } from './syntax_v3'
import { EncodableDeckV4 } from './syntax_v4'
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

  const deck = EncodableDeckV1.fromList(cards)
  deck.encode(writer)
  writer.end()

  return Buffer.concat([bufWriteable.buffer]).toString('base64url')
}

export function decodeList(encoded: string): string {
  const bytes = Buffer.from(encoded, 'base64url');
  let reader = new BitstreamReader();
  reader.addBuffer(bytes)
  const deck = EncodableDeckV1.decode(reader)
  const text = deck.asCardRefQty.map((cq) => `${cq.quantity} ${cq.id}`).join("\n")
  return text
}

export function encodeListV2(list: string): string {
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

  const deck = EncodableDeckV2.fromList(cards)
  deck.encode(writer)
  writer.end()

  return Buffer.concat([bufWriteable.buffer]).toString('base64url')
}

export function decodeListV2(encoded: string): string {
  const bytes = Buffer.from(encoded, 'base64url');
  let reader = new BitstreamReader();
  reader.addBuffer(bytes)
  const deck = EncodableDeckV2.decode(reader)
  const text = deck.asCardRefQty.map((cq) => `${cq.quantity} ${cq.id}`).join("\n")
  return text
}

export function encodeListV3(list: string): string {
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

  const deck = EncodableDeckV3.fromList(cards)
  deck.encode(writer)
  writer.end()

  return Buffer.concat([bufWriteable.buffer]).toString('base64url')
}

export function decodeListV3(encoded: string): string {
  const bytes = Buffer.from(encoded, 'base64url');
  let reader = new BitstreamReader();
  reader.addBuffer(bytes)
  const deck = EncodableDeckV3.decode(reader)
  const text = deck.asCardRefQty.map((cq) => `${cq.quantity} ${cq.id}`).join("\n")
  return text
}

function parseDeckList(list: string): Array<CardRefQty> {
  return list.split("\n").flatMap((ln) => {
    const match = ln.trim().match(/^(\d+) (\w+)$/)
    if (match) {
      const quantity = parseInt(match[1], 10)
      if (quantity > 0) {
        return [{ quantity, id: match[2] }]
      }
    }
    return []
  })
}

export function encodeListV4(list: string): string {
  const cards = parseDeckList(list)

  const bufWriteable = new BufferedWritable()
  const writer = new BitstreamWriter(bufWriteable, 1024)

  const deck = EncodableDeckV4.fromList(cards)
  deck.encode(writer)
  writer.end()

  return Buffer.concat([bufWriteable.buffer]).toString('base64url')
}

export function decodeListV4(encoded: string): string {
  const bytes = Buffer.from(encoded, 'base64url')
  const reader = new BitstreamReader()
  reader.addBuffer(bytes)
  const deck = EncodableDeckV4.decode(reader)
  const text = deck.asCardRefQty.map((cq) => `${cq.quantity} ${cq.id}`).join("\n")
  return text
}