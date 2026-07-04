import { RefFaction, RefRarity, CardId, CardRefQty, CardRefElements, RefProduct } from './models'
import { BitstreamReader, BitstreamWriter } from './bitstream'
import { getFamilyMeta, type FamilyMeta } from './canonical_sets'

const MAX_REFS_PER_FACTION_GROUP = 63

// Wire version nibble identifying the Compact format (the standard format uses 1).
const COMPACT_VERSION = 2

function wireRarityFromRef(rarityId: number): number {
  if (rarityId === 4) {
    return 0
  }
  if (rarityId < 0 || rarityId > 3) {
    throw new EncodingError(`Invalid rarity ID (${rarityId})`)
  }
  return rarityId
}

function encodeUniqueWord(ref: CardRefElements, meta: FamilyMeta): number {
  const uniqueId = ref.uniq_num
  if (uniqueId === undefined) {
    throw new EncodingError(`Unique card is missing unique_id (${ref})`)
  }
  if (meta.dualCoreCoreks) {
    if (uniqueId < 1 || uniqueId > 32767) {
      throw new EncodingError(`Unique ID out of range for dual CORE/COREKS family (${uniqueId})`)
    }
    const isCoreks = ref.set_code_name === 'COREKS' ? 1 : 0
    return (uniqueId << 1) | isCoreks
  }
  if (uniqueId < 1 || uniqueId > 65535) {
    throw new EncodingError(`Unique ID out of range (${uniqueId})`)
  }
  return uniqueId
}

function decodeUniqueWord(
  uniqueWord: number,
  meta: FamilyMeta,
): { uniqueId: number; setName: string } {
  if (meta.dualCoreCoreks) {
    const isCoreks = uniqueWord & 1
    const uniqueId = uniqueWord >> 1
    if (uniqueId < 1) {
      throw new DecodingError(`Invalid dual-family unique_id (${uniqueId})`)
    }
    return { uniqueId, setName: isCoreks ? 'COREKS' : 'CORE' }
  }
  if (uniqueWord < 1) {
    throw new DecodingError(`Invalid unique_id (${uniqueWord})`)
  }
  return { uniqueId: uniqueWord, setName: meta.canonicalSet }
}

function decodeSetName(factionId: number, nif: number, wireRarity: number, uniqueWord?: number): string {
  const meta = getFamilyMeta(factionId, nif)
  if (!meta) {
    throw new DecodingError(`Unknown family (faction=${factionId}, nif=${nif})`)
  }
  if (wireRarity === 3) {
    if (uniqueWord === undefined) {
      throw new DecodingError('Missing unique word for unique card')
    }
    return decodeUniqueWord(uniqueWord, meta).setName
  }
  return meta.canonicalSet
}

export class EncodableEntry {
  faction: number
  numberInFaction: number
  wireRarity: number
  uniqueWord: number | undefined

  static decode(reader: BitstreamReader, factionId: number): EncodableEntry {
    const self = new EncodableEntry()
    self.faction = factionId

    const nifMinus1 = reader.readSync(8)
    self.numberInFaction = nifMinus1 + 1
    if (self.numberInFaction < 1) {
      throw new DecodingError(`Invalid number_in_faction (${self.numberInFaction})`)
    }

    self.wireRarity = reader.readSync(2)
    if (self.wireRarity > 3) {
      throw new DecodingError(`Invalid rarity (${self.wireRarity})`)
    }

    if (self.wireRarity === 3) {
      self.uniqueWord = reader.readSync(16)
    }

    return self
  }

  encode(writer: BitstreamWriter) {
    if (this.faction < 1 || this.faction > 7) {
      throw new EncodingError(`Invalid faction ID (${this.faction})`)
    }
    if (this.numberInFaction < 1 || this.numberInFaction > 256) {
      throw new EncodingError(`Number in faction out of range (${this.numberInFaction})`)
    }
    if (this.wireRarity > 3) {
      throw new EncodingError(`Invalid wire rarity (${this.wireRarity})`)
    }

    writer.write(8, this.numberInFaction - 1)
    writer.write(2, this.wireRarity)
    if (this.wireRarity === 3) {
      if (this.uniqueWord === undefined) {
        throw new EncodingError('Missing unique word for unique card')
      }
      if (this.uniqueWord > 0xFFFF) {
        throw new EncodingError('Cannot encode unique word greater than 65535')
      }
      writer.write(16, this.uniqueWord)
    }
  }

  get asCardId(): CardId {
    const setName = decodeSetName(this.faction, this.numberInFaction, this.wireRarity, this.uniqueWord)

    let id = 'ALT_'
    id += setName
    id += '_'
    id += RefProduct.Booster
    id += '_'
    switch (this.faction) {
      case 1: id += RefFaction.Axiom; break
      case 2: id += RefFaction.Bravos; break
      case 3: id += RefFaction.Lyra; break
      case 4: id += RefFaction.Muna; break
      case 5: id += RefFaction.Ordis; break
      case 6: id += RefFaction.Yzmir; break
      case 7: id += RefFaction.Neutral; break
      default: throw new EncodingError(`Invalid faction ID (${this.faction})`)
    }
    id += '_'
    if (
      this.numberInFaction < 10
      && !(this.faction === 7 && (setName === 'CORE' || setName === 'COREKS'))
    ) {
      id += '0'
    }
    id += this.numberInFaction
    id += '_'
    switch (this.wireRarity) {
      case 0: id += RefRarity.Common; break
      case 1: id += RefRarity.Rare; break
      case 2: id += RefRarity.RareOOF; break
      case 3: {
        const meta = getFamilyMeta(this.faction, this.numberInFaction)
        if (!meta || this.uniqueWord === undefined) {
          throw new EncodingError('Missing family metadata for unique card')
        }
        const { uniqueId } = decodeUniqueWord(this.uniqueWord, meta)
        id += RefRarity.Unique + '_' + uniqueId
        break
      }
      default: throw new EncodingError(`Invalid wire rarity (${this.wireRarity})`)
    }
    return id
  }

  static fromId(id: CardId): EncodableEntry {
    const ref = new CardRefElements(id)
    const meta = getFamilyMeta(ref.factionId, ref.num_in_faction)
    if (!meta) {
      throw new EncodingError(`Unknown family for card id '${id}'`)
    }

    const entry = new EncodableEntry()
    entry.faction = ref.factionId
    entry.numberInFaction = ref.num_in_faction
    entry.wireRarity = wireRarityFromRef(ref.rarityId)
    if (entry.wireRarity === 3) {
      entry.uniqueWord = encodeUniqueWord(ref, meta)
    }
    return entry
  }
}

export class EncodableEntryQty {
  quantity: number
  entry: EncodableEntry

  static decode(
    reader: BitstreamReader,
    allQtyOne: boolean,
    factionId: number,
  ): EncodableEntryQty {
    const self = new EncodableEntryQty()
    if (allQtyOne) {
      self.quantity = 1
    } else {
      const simpleQty = reader.readSync(2)
      if (simpleQty > 0) {
        self.quantity = simpleQty
      } else {
        const extended = reader.readSync(6)
        self.quantity = extended === 0 ? 0 : extended + 3
      }
    }
    self.entry = EncodableEntry.decode(reader, factionId)
    return self
  }

  encode(writer: BitstreamWriter, allQtyOne: boolean) {
    if (!allQtyOne) {
      if (this.quantity > 0 && this.quantity <= 3) {
        writer.write(2, this.quantity)
      } else if (this.quantity > 3) {
        if (this.quantity > 65) {
          throw new EncodingError(`Cannot encode card quantity (${this.quantity}) greater than 65`)
        }
        writer.write(2, 0)
        writer.write(6, this.quantity - 3)
      } else {
        writer.write(8, 0)
      }
    }
    this.entry.encode(writer)
  }

  get asCardRefQty(): CardRefQty {
    return { quantity: this.quantity, id: this.entry.asCardId }
  }

  static from(quantity: number, card: CardId): EncodableEntryQty {
    const ecq = new EncodableEntryQty()
    ecq.quantity = quantity
    ecq.entry = EncodableEntry.fromId(card)
    return ecq
  }
}

export class EncodableFactionGroup {
  factionId: number
  entries: EncodableEntryQty[]

  static decode(reader: BitstreamReader, allQtyOne: boolean): EncodableFactionGroup {
    const self = new EncodableFactionGroup()
    self.factionId = reader.readSync(3)
    if (self.factionId === 0) {
      throw new DecodingError(`Invalid faction ID (${self.factionId})`)
    }

    const refsCount = reader.readSync(6)
    if (refsCount < 1) {
      throw new DecodingError(`Invalid refs_count (${refsCount})`)
    }

    const entries = new Array<EncodableEntryQty>()
    for (let i = 0; i < refsCount; i++) {
      entries.push(EncodableEntryQty.decode(reader, allQtyOne, self.factionId))
    }
    self.entries = entries
    return self
  }

  encode(writer: BitstreamWriter, allQtyOne: boolean) {
    if (this.entries.length <= 0) {
      throw new EncodingError('Cannot encode a FactionGroup with 0 entries')
    }
    if (this.entries.length > MAX_REFS_PER_FACTION_GROUP) {
      throw new EncodingError(
        `FactionGroup exceeds max refs (${this.entries.length} > ${MAX_REFS_PER_FACTION_GROUP})`,
      )
    }

    writer.write(3, this.factionId)
    writer.write(6, this.entries.length)
    for (const entryQty of this.entries) {
      entryQty.encode(writer, allQtyOne)
    }
  }

  static from(entries: EncodableEntryQty[]): EncodableFactionGroup {
    const group = new EncodableFactionGroup()
    group.entries = entries
    group.factionId = entries[0].entry.faction
    return group
  }
}

export class EncodableDeckCompact {
  version: number
  allQtyOne: boolean
  factionGroups: EncodableFactionGroup[]

  static decode(reader: BitstreamReader): EncodableDeckCompact {
    const self = new EncodableDeckCompact()
    self.version = reader.readSync(4)
    if (self.version !== COMPACT_VERSION) {
      throw new DecodingError(`Invalid version (${self.version})`)
    }

    const groupsCount = reader.readSync(8)
    self.allQtyOne = reader.readSync(1) === 1
    const reserved1 = reader.readSync(1)
    const reserved2 = reader.readSync(2)
    if (reserved1 !== 0 || reserved2 !== 0) {
      throw new DecodingError('Invalid reserved header bits')
    }

    const groups = new Array<EncodableFactionGroup>()
    for (let i = 0; i < groupsCount; i++) {
      groups.push(EncodableFactionGroup.decode(reader, self.allQtyOne))
    }
    self.factionGroups = groups
    return self
  }

  encode(writer: BitstreamWriter) {
    writer.write(4, this.version)
    writer.write(8, this.factionGroups.length)
    writer.write(1, this.allQtyOne ? 1 : 0)
    writer.write(1, 0)
    writer.write(2, 0)
    for (const group of this.factionGroups) {
      group.encode(writer, this.allQtyOne)
    }
    if (writer.offset % 8 > 0) {
      writer.write(8 - (writer.offset % 8), 0)
    }
  }

  get asCardRefQty(): Array<CardRefQty> {
    return this.factionGroups.reduce((list, group) => {
      return list.concat(group.entries.map((eq) => eq.asCardRefQty))
    }, Array<CardRefQty>())
  }

  static fromList(refQtyList: Array<CardRefQty>): EncodableDeckCompact {
    const merged = mergeEntries(refQtyList.map((rq) => EncodableEntryQty.from(rq.quantity, rq.id)))

    const allQtyOne = merged.every((eq) => eq.quantity === 1)

    const byFaction = new Map<number, EncodableEntryQty[]>()
    for (const eq of merged) {
      const fid = eq.entry.faction
      let group = byFaction.get(fid)
      if (!group) {
        group = []
        byFaction.set(fid, group)
      }
      group.push(eq)
    }

    const sortedFactions = Array.from(byFaction.keys()).sort((a, b) => a - b)
    const factionGroups: EncodableFactionGroup[] = []
    for (const fid of sortedFactions) {
      const sorted = byFaction.get(fid)!
        .sort((a, b) => a.entry.numberInFaction - b.entry.numberInFaction)
      const blocks = arraySplitInGroupsOf(sorted, MAX_REFS_PER_FACTION_GROUP)
      for (const block of blocks) {
        factionGroups.push(EncodableFactionGroup.from(block))
      }
    }

    const deck = new EncodableDeckCompact()
    deck.version = COMPACT_VERSION
    deck.allQtyOne = allQtyOne
    deck.factionGroups = factionGroups
    return deck
  }
}

function mergeKey(eq: EncodableEntryQty): string {
  const e = eq.entry
  return `${e.faction}:${e.numberInFaction}:${e.wireRarity}:${e.uniqueWord ?? ''}`
}

function mergeEntries(entries: EncodableEntryQty[]): EncodableEntryQty[] {
  const merged = new Map<string, EncodableEntryQty>()
  for (const eq of entries) {
    const key = mergeKey(eq)
    const existing = merged.get(key)
    if (existing) {
      existing.quantity += eq.quantity
      if (existing.quantity > 65) {
        throw new EncodingError(`Merged quantity exceeds 65 for ${eq.entry.asCardId}`)
      }
    } else {
      merged.set(key, eq)
    }
  }
  return Array.from(merged.values())
}

function arraySplitInGroupsOf<T>(array: Array<T>, maxGroupSize: number): Array<Array<T>> {
  const out: Array<Array<T>> = []
  for (let i = 0; i < array.length; i += maxGroupSize) {
    out.push(array.slice(i, i + maxGroupSize))
  }
  return out
}

export class DecodingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DecodingError'
  }
}

export class EncodingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EncodingError'
  }
}
