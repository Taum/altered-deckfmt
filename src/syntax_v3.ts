import { RefFaction, RefRarity, CardId, CardRefQty, CardRefElements, RefProduct } from './models';
import { BitstreamReader, BitstreamWriter } from './bitstream';

// V3 removes RefSetCode usage from the codec. We still need per-set parameters,
// so we keep a mapping keyed by set name.
const SetNameToId: Record<string, number> = {
  COREKS: 1,
  CORE: 2,
  ALIZE: 3,
  BISE: 4,
  TCS3: 5,
  WCQ25: 6,
  WCS25: 7,
  CYCLONE: 8,
  DUSTER: 9,
  DUSTERTOP: 10,
  DUSTERCB: 11,
  DUSTEROP: 12,
}

const SetCodeIdBitLengthMap: Record<number, number> = {
  1: 5,   // CoreKS        range 0-31
  2: 5,   // Core          range 0-31
  3: 6,   // Alize         range 0-63
  4: 6,   // Bise          range 0-63
  5: 6,   // TumultS3      range 0-63
  6: 5,   // WCQualifier25 range 0-31
  7: 5,   // WCSeries25    range 0-31
  8: 7,   // Cyclone       range 0-127
  9: 7,   // Duster        range 0-127
  10: 7,  // Duster TOP    range 0-127
  11: 7,  // Duster CB     range 0-127
  12: 7,  // Duster OP     range 0-127
}

const SetCodeIdWithLegacyRarityLength = [
  1,  // CoreKS
  2,  // Core
  3,  // Alize
  4,  // Bise
  5,  // TumultS3
  6,  // WCQualifier25
  7,  // WCSeries25
  8,  // Cyclone
]

const INITIAL_FAMILY_ID_BIT_LENGTH = 12

function encodeSetName(writer: BitstreamWriter, setName: string) {
  if (!/^[A-Z0-9]+$/.test(setName)) {
    throw new EncodingError(`Invalid set name '${setName}' (must match /^[A-Z0-9]+$/)`)
  }
  if (setName.length < 1 || setName.length > 16) {
    throw new EncodingError(`Invalid set name length (${setName.length}) for '${setName}' (must be 1..16)`)
  }

  writer.write(4, setName.length - 1)
  for (let i = 0; i < setName.length; i++) {
    const ch = setName[i]
    let code: number
    if (ch >= 'A' && ch <= 'Z') {
      code = ch.charCodeAt(0) - 65 // 'A' => 0
    } else if (ch >= '0' && ch <= '9') {
      code = 26 + (ch.charCodeAt(0) - 48) // '0' => 26
    } else {
      throw new EncodingError(`Invalid set name character '${ch}' in '${setName}'`)
    }
    writer.write(6, code)
  }
}

function decodeSetName(reader: BitstreamReader): string {
  const lenMinus1 = reader.readSync(4)
  const len = lenMinus1 + 1
  let out = ''
  for (let i = 0; i < len; i++) {
    const code = reader.readSync(6)
    if (code < 26) {
      out += String.fromCharCode(65 + code)
    } else if (code < 36) {
      out += String.fromCharCode(48 + (code - 26))
    } else {
      throw new DecodingError(`Invalid set name char code (${code}) @offset=${reader.offset}`)
    }
  }
  return out
}

export class EncodableCard {
  setCodeId: number
  setCodeName: string
  product: number | null
  faction: number
  numberInFaction: number
  rarity: number
  uniqueId: number | undefined

  static decode(reader: BitstreamReader, context: DecodingContext, isFirstCard: boolean) {
    const self = new EncodableCard()
    if (context.setCodeId === undefined || context.setCodeName === undefined) {
      throw new DecodingError("Tried to decode Card without SetCode in context")
    }
    self.setCodeId = context.setCodeId
    self.setCodeName = context.setCodeName

    const productBit = reader.readSync(1)
    if (productBit == 1) {
      self.product = null
    } else {
      self.product = reader.readSync(2)
      if (self.product == 0 || self.product == 3) {
        throw new DecodingError(`Invalid product ID (${self.product})`)
      }
    }

    self.faction = reader.readSync(3)
    if (self.faction == 0) {
      throw new DecodingError(`Invalid faction ID (${self.faction})`)
    }

    if (isFirstCard) {
      self.numberInFaction = reader.readSync(INITIAL_FAMILY_ID_BIT_LENGTH)
      context.familyIdMin = self.numberInFaction
    } else {
      if (context.familyIdMin === undefined || context.familyIdBitLength === undefined) {
        throw new DecodingError("Tried to decode Card without familyIdMin/familyIdBitLength in context")
      }
      const nifOffset = reader.readSync(context.familyIdBitLength)
      self.numberInFaction = context.familyIdMin + nifOffset
    }

    const rarityBitLength = SetCodeIdWithLegacyRarityLength.includes(self.setCodeId) ? 2 : 3
    self.rarity = reader.readSync(rarityBitLength)
    if (self.rarity == 3) {
      self.uniqueId = reader.readSync(16)
    }

    return self
  }

  encode(writer: BitstreamWriter, familyIdMin: number, familyIdBitLength: number, isFirstCard: boolean) {
    if (this.product == null) {
      writer.write(1, 1)
    } else {
      writer.write(1, 0)
      writer.write(2, this.product)
    }

    writer.write(3, this.faction)

    if (isFirstCard) {
      if (this.numberInFaction > ((1 << INITIAL_FAMILY_ID_BIT_LENGTH) - 1)) {
        throw new EncodingError(
          `First Family ID out of range (${this.numberInFaction}) for set ${this.setCodeName} (max value ${(1 << INITIAL_FAMILY_ID_BIT_LENGTH) - 1})`,
        )
      }
      writer.write(INITIAL_FAMILY_ID_BIT_LENGTH, this.numberInFaction)
    } else {
      const nifOffset = this.numberInFaction - familyIdMin
      if (nifOffset < 0 || nifOffset >= (1 << familyIdBitLength)) {
        throw new EncodingError(
          `Family ID out of range (${this.numberInFaction}) for set ${this.setCodeName} (range: ${familyIdMin} - ${familyIdMin + (1 << familyIdBitLength) - 1})`,
        )
      }
      writer.write(familyIdBitLength, nifOffset)
    }

    const rarityBitLength = SetCodeIdWithLegacyRarityLength.includes(this.setCodeId) ? 2 : 3
    writer.write(rarityBitLength, this.rarity)

    if (this.uniqueId !== undefined) {
      if (this.uniqueId > 0xFFFF) {
        throw new EncodingError("Cannot encode unique ID greater than 65535")
      }
      writer.write(16, this.uniqueId)
    }
  }

  get asCardId(): CardId {
    let id = "ALT_"
    id += this.setCodeName
    id += "_"
    switch (this.product) {
      case null: id += RefProduct.Booster; break;
      case 1: id += RefProduct.Promo; break;
      case 2: id += RefProduct.AltArt; break;
      default: throw new EncodingError(`Invalid product ID (${this.product})`)
    }
    id += "_"
    switch (this.faction) {
      case 1: id += RefFaction.Axiom; break;
      case 2: id += RefFaction.Bravos; break;
      case 3: id += RefFaction.Lyra; break;
      case 4: id += RefFaction.Muna; break;
      case 5: id += RefFaction.Ordis; break;
      case 6: id += RefFaction.Yzmir; break;
      case 7: id += RefFaction.Neutral; break;
      default: throw new EncodingError(`Invalid faction ID (${this.faction})`)
    }
    id += "_"
    if (this.numberInFaction < 10 && !(this.faction == 7 && (this.setCodeId == 1 || this.setCodeId == 2))) {
      id += "0"
    }
    id += this.numberInFaction
    id += "_"
    switch (this.rarity) {
      case 0: id += RefRarity.Common; break;
      case 1: id += RefRarity.Rare; break;
      case 2: id += RefRarity.RareOOF; break;
      case 3: id += RefRarity.Unique + "_" + this.uniqueId; break;
      case 4: id += RefRarity.Exalt; break;
      default: throw new EncodingError(`Invalid rarity ID (${this.rarity})`)
    }
    return id
  }

  static fromId(id: CardId): EncodableCard {
    const ec = new EncodableCard()
    const refEls = new CardRefElements(id)
    ec.setCodeName = refEls.set_code_name
    ec.setCodeId = refEls.setId
    ec.product = refEls.productId
    ec.faction = refEls.factionId
    ec.numberInFaction = refEls.num_in_faction
    ec.rarity = refEls.rarityId
    ec.uniqueId = refEls.uniq_num
    return ec
  }
}

export class EncodableCardQty {
  quantity: number
  card: EncodableCard

  static decode(reader: BitstreamReader, context: DecodingContext, isFirstCard: boolean): EncodableCardQty {
    const self = new EncodableCardQty()
    const simpleQty = reader.readSync(2)
    if (simpleQty > 0) {
      self.quantity = simpleQty
    } else {
      const extended = reader.readSync(6)
      self.quantity = extended == 0 ? 0 : extended + 3
    }
    self.card = EncodableCard.decode(reader, context, isFirstCard)
    return self
  }

  encode(writer: BitstreamWriter, familyIdMin: number, familyIdBitLength: number, isFirstCard: boolean) {
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
    this.card.encode(writer, familyIdMin, familyIdBitLength, isFirstCard)
  }

  get asCardRefQty(): CardRefQty {
    return { quantity: this.quantity, id: this.card.asCardId }
  }

  static from(quantity: number, card: CardId): EncodableCardQty {
    const ecq = new EncodableCardQty()
    ecq.quantity = quantity
    ecq.card = EncodableCard.fromId(card)
    return ecq
  }
}

export class EncodableSetGroup {
  setCodeName: string
  setCodeId: number
  cardQty: EncodableCardQty[]

  static decode(reader: BitstreamReader, context: DecodingContext): EncodableSetGroup {
    const self = new EncodableSetGroup()
    self.setCodeName = decodeSetName(reader)
    const setId = SetNameToId[self.setCodeName]
    if (setId === undefined || SetCodeIdBitLengthMap[setId] === undefined) {
      throw new DecodingError(`Invalid Set name (${self.setCodeName}) @offset=${reader.offset}`)
    }
    self.setCodeId = setId

    context.setCodeName = self.setCodeName
    context.setCodeId = self.setCodeId

    const cardRefCount = reader.readSync(6)
    if (cardRefCount > 1) {
      context.familyIdBitLength = reader.readSync(4)
    } else {
      context.familyIdBitLength = undefined
    }

    const cards = new Array<EncodableCardQty>()
    for (let i = 0; i < cardRefCount; i++) {
      cards.push(EncodableCardQty.decode(reader, context, i === 0))
    }
    self.cardQty = cards

    context.setCodeName = undefined
    context.setCodeId = undefined
    context.familyIdMin = undefined
    context.familyIdBitLength = undefined

    return self
  }

  encode(writer: BitstreamWriter) {
    if (this.cardQty.length <= 0) {
      throw new EncodingError("Cannot encode a SetGroup with 0 cards")
    }

    const sortedCardQty = [...this.cardQty].sort(
      (a, b) => a.card.numberInFaction - b.card.numberInFaction,
    )

    const familyIdMin = sortedCardQty[0].card.numberInFaction
    const familyIdMax = sortedCardQty[sortedCardQty.length - 1].card.numberInFaction

    const familyIdBitLength = Math.ceil(Math.log2(familyIdMax - familyIdMin + 1))
    if (familyIdBitLength > 0xF) {
      throw new EncodingError(`Family ID range is too large (${familyIdMax - familyIdMin + 1}) for set ${this.setCodeName}`)
    }
    if (familyIdMin > ((1 << INITIAL_FAMILY_ID_BIT_LENGTH) - 1)) {
      throw new EncodingError(`Family ID minimum is too large (${familyIdMin}) for set ${this.setCodeName}`)
    }

    const setName = sortedCardQty[0].card.setCodeName
    encodeSetName(writer, setName)
    writer.write(6, sortedCardQty.length)
    if (sortedCardQty.length > 1) {
      writer.write(4, familyIdBitLength)
    }

    let i = 0
    for (const cardQty of sortedCardQty) {
      cardQty.encode(writer, familyIdMin, familyIdBitLength, i === 0)
      i++
    }
  }

  static from(rqs: CardRefQty[]): EncodableSetGroup {
    const esg = new EncodableSetGroup()
    esg.cardQty = rqs.map((rq) => EncodableCardQty.from(rq.quantity, rq.id))
    esg.setCodeName = esg.cardQty[0].card.setCodeName
    esg.setCodeId = esg.cardQty[0].card.setCodeId
    return esg
  }
}

export class EncodableDeck {
  version: number
  setGroups: EncodableSetGroup[]

  static decode(reader: BitstreamReader): EncodableDeck {
    const self = new EncodableDeck()
    const context = new DecodingContext()
    self.version = reader.readSync(4)
    if (self.version !== 3) {
      throw new DecodingError(`Invalid version (${self.version})`)
    }

    const groupsCount = reader.readSync(8)
    const groups = new Array<EncodableSetGroup>()
    for (let i = 0; i < groupsCount; i++) {
      groups.push(EncodableSetGroup.decode(reader, context))
    }
    self.setGroups = groups
    return self
  }

  encode(writer: BitstreamWriter) {
    writer.write(4, this.version)
    writer.write(8, this.setGroups.length)
    for (const group of this.setGroups) {
      group.encode(writer)
    }
    if (writer.offset % 8 > 0) {
      writer.write(8 - (writer.offset % 8), 0)
    }
  }

  get asCardRefQty(): Array<CardRefQty> {
    return this.setGroups.reduce((list, group) => {
      return list.concat(group.cardQty.map((cq) => cq.asCardRefQty))
    }, Array<CardRefQty>())
  }

  static fromList(refQtyList: Array<CardRefQty>): EncodableDeck {
    const groups = EncodableDeck.groupedBySetName(refQtyList)
      .map((g) => {
        const blocks = arraySplitInGroupsOf(g, 63)
        return blocks.map((block) => EncodableSetGroup.from(block))
      })

    const deck = new EncodableDeck()
    deck.version = 3
    deck.setGroups = groups.flat()
    return deck
  }

  private static groupedBySetName(refQtyList: Array<CardRefQty>): Array<Array<CardRefQty>> {
    const groups = new Map<string, Array<CardRefQty>>()
    for (const rq of refQtyList) {
      const setName = new CardRefElements(rq.id).set_code_name
      let g = groups.get(setName)
      if (!g) {
        g = []
        groups.set(setName, g)
      }
      g.push(rq)
    }
    return Array.from(groups, ([_, v]) => v)
  }
}

function arraySplitInGroupsOf<T>(array: Array<T>, maxGroupSize: number): Array<Array<T>> {
  const out: Array<Array<T>> = []
  for (let i = 0; i < array.length; i += maxGroupSize) {
    out.push(array.slice(i, i + maxGroupSize))
  }
  return out
}

export class DecodingContext {
  setCodeName?: string
  setCodeId?: number
  familyIdMin?: number
  familyIdBitLength?: number
}

export class DecodingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "DecodingError"
  }
}

export class EncodingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "EncodingError"
  }
}

