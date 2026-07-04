import { EncodableDeck } from './syntax'
import { EncodableDeckCompact } from './syntax_compact'
import { CardRefQty } from './models'

import { BufferedWritable, BitstreamWriter, BitstreamReader } from './bitstream'
import { Buffer } from 'buffer'

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

/** Encode a decklist using the standard (lossless) binary format. */
export function encodeList(list: string): string {
  const cards = parseDeckList(list)

  const bufWriteable = new BufferedWritable()
  const writer = new BitstreamWriter(bufWriteable, 1024)

  const deck = EncodableDeck.fromList(cards)
  deck.encode(writer)
  writer.end()

  return Buffer.concat([bufWriteable.buffer]).toString('base64url')
}

/** Decode a decklist produced by {@link encodeList}. */
export function decodeList(encoded: string): string {
  const bytes = Buffer.from(encoded, 'base64url');
  let reader = new BitstreamReader();
  reader.addBuffer(bytes)
  const deck = EncodableDeck.decode(reader)
  const text = deck.asCardRefQty.map((cq) => `${cq.quantity} ${cq.id}`).join("\n")
  return text
}

/**
 * Encode a decklist using the Compact format.
 *
 * The Compact format is smaller than the standard format but lossy: it does
 * not preserve Alternate/Promo variants and normalizes the Set of each card
 * (see FORMAT_SPEC_COMPACT.md).
 */
export function encodeListCompact(list: string): string {
  const cards = parseDeckList(list)

  const bufWriteable = new BufferedWritable()
  const writer = new BitstreamWriter(bufWriteable, 1024)

  const deck = EncodableDeckCompact.fromList(cards)
  deck.encode(writer)
  writer.end()

  return Buffer.concat([bufWriteable.buffer]).toString('base64url')
}

/** Decode a decklist produced by {@link encodeListCompact}. */
export function decodeListCompact(encoded: string): string {
  const bytes = Buffer.from(encoded, 'base64url')
  const reader = new BitstreamReader()
  reader.addBuffer(bytes)
  const deck = EncodableDeckCompact.decode(reader)
  const text = deck.asCardRefQty.map((cq) => `${cq.quantity} ${cq.id}`).join("\n")
  return text
}
