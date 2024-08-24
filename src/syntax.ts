import { RefSetCode, RefFaction, RefRarity, CardId, CardRefQty, CardRefElements } from './models';
import { BitstreamReader, BitstreamWriter } from './bitstream';

export class EncodableCard {
  setCode: number
  faction: number
  numberInFaction: number
  rarity: number
  uniqueId: number | undefined

  static decode(reader: BitstreamReader, context: DecodingContext) {
    const self = new EncodableCard()
    if (context.setCode === undefined) {
      throw new DecodingError("Tried to decode Card without SetCode in context")
    }
    self.setCode = context.setCode 
    self.faction = reader.readSync(3)
    if (self.faction == 0) {
      throw new DecodingError(`Invalid faction ID (${self.faction})`)
    }
    self.numberInFaction = reader.readSync(5)
    self.rarity = reader.readSync(2)
    if (self.rarity == 3) {
      self.uniqueId = reader.readSync(16)
    }
    return self
  }

  encode(writer: BitstreamWriter) {
    writer.write(3, this.faction)
    writer.write(5, this.numberInFaction)
    writer.write(2, this.rarity)
    if (this.uniqueId !== undefined) {
      writer.write(16, this.uniqueId)
    }
  }

  get asCardId(): CardId {
    let id = "ALT_"
    switch (this.setCode) {
      case 1: id += RefSetCode.Core; break;
      case 2: id += RefSetCode.CoreKS; break;
    }
    id += "_B_"
    switch (this.faction) {
      case 1: id += RefFaction.Axiom; break;
      case 2: id += RefFaction.Bravos; break;
      case 3: id += RefFaction.Lyra; break;
      case 4: id += RefFaction.Muna; break;
      case 5: id += RefFaction.Ordis; break;
      case 6: id += RefFaction.Yzmir; break;
      case 7: id += RefFaction.Neutral; break;
    }
    id += "_"
    if (this.numberInFaction < 10 && this.faction != 7) {
      // Fun fact: Neutral card (Mana Orb) does not use 0 prefix
      id += "0"
    }
    id += this.numberInFaction
    id += "_"
    switch (this.rarity) {
      case 0: id += RefRarity.Common; break;
      case 1: id += RefRarity.Rare; break;
      case 2: id += RefRarity.RareOOF; break;
      case 3: id += RefRarity.Unique + "_" + this.uniqueId; break;
    }
    return id
  }

  static fromId(id: CardId): EncodableCard {
    let ec = new EncodableCard()
    let refEls = new CardRefElements(id)
    ec.setCode = refEls.setId
    ec.faction = refEls.factionId
    ec.numberInFaction = refEls.num_in_faction
    ec.rarity = refEls.rarityId
    ec.uniqueId = refEls.uniq_num
    return ec
  }
}

export class EncodableCardQty {
  quantity: number // VLE: 2 (+6) bits
  card: EncodableCard

  static decode(reader: BitstreamReader, context: DecodingContext): EncodableCardQty {
    const self = new EncodableCardQty()
    const simpleQty = reader.readSync(2)
    if (simpleQty > 0) {
      self.quantity = simpleQty
    } else {
      const extended = reader.readSync(6)
      self.quantity = extended == 0 ? 0 : extended + 3
    } 
    self.card = EncodableCard.decode(reader, context)
    return self
  }

  encode(writer: BitstreamWriter) {
    if (this.quantity > 0 && this.quantity <= 3) {
      writer.write(2, this.quantity)
    } else if (this.quantity > 3) {
      if (this.quantity > 65) {
        throw new EncodingError(`Cannot encode card quantity (${this.quantity}) greater than 65`)
      }
      writer.write(2, 0)
      writer.write(6, this.quantity - 3)
    } else {
      // qty=0 is written with 2 zeroes followed by 6 zeroes
      writer.write(8, 0)
    }
    
    this.card.encode(writer)
  }

  get asCardRefQty(): CardRefQty {
    return {
      quantity: this.quantity,
      id: this.card!.asCardId
    }
  }
  
  static from(quantity: number, card: CardId): EncodableCardQty {
    let ecq = new EncodableCardQty()
    ecq.quantity = quantity
    ecq.card = EncodableCard.fromId(card)
    return ecq
  }
}

export class EncodableSetGroup {
  setCode: number // 8 bits
  cardQty: EncodableCardQty[] // count: 6 bits

  static decode(reader: BitstreamReader, context: DecodingContext): EncodableSetGroup {
    const self = new EncodableSetGroup()
    self.setCode = reader.readSync(8)
    if (self.setCode == 0) {
      throw new DecodingError(`Invalid SetCode ID (${self.setCode})`)
    }
    context.setCode = self.setCode

    const cardRefCount = reader.readSync(6)
    const cards = new Array<EncodableCardQty>()
    for (let i = 0 ; i < cardRefCount ; i++) {
      cards.push(EncodableCardQty.decode(reader, context))
    }
    self.cardQty = cards
    context.setCode = undefined

    return self
  }
  
  encode(writer: BitstreamWriter) {
    if (this.cardQty.length <= 0) {
      throw new EncodingError("Cannot encode a SetGroup with 0 cards")
    }
    const setCode = this.cardQty[0].card.setCode
    writer.write(8, setCode)
    writer.write(6, this.cardQty.length)
    for (let cardQty of this.cardQty) {
      cardQty.encode(writer)
    }
  }
  
  static from(rqs: CardRefQty[]) {
    let esg = new EncodableSetGroup()
    esg.cardQty = rqs.map((rq) => EncodableCardQty.from(rq.quantity, rq.id))
    return esg
  }
}

export class EncodableDeck {
  version: number // 4 bits
  setGroups: EncodableSetGroup[] // count: 8 bits

  static decode(reader: BitstreamReader): EncodableDeck {
    const self = new EncodableDeck()
    const context = new DecodingContext()
    self.version = reader.readSync(4)
    if (self.version !== 1) {
      throw new DecodingError(`Invalid version (${self.version}`);
    }

    const groupsCount = reader.readSync(8)
    const groups = new Array<EncodableSetGroup>()
    for (let i = 0 ; i < groupsCount ; i++) {
      groups.push(EncodableSetGroup.decode(reader, context))
    }
    self.setGroups = groups
    return self
  }
  
  encode(writer: BitstreamWriter) {
    writer.write(4, this.version)
    writer.write(8, this.setGroups.length)
    for (let group of this.setGroups) {
      group.encode(writer)
    }
    
    const padding = (8 - writer.offset % 8)
    writer.write(padding, 0)
  }

  get asCardRefQty(): Array<CardRefQty> {
    return this.setGroups.reduce((list, groups) => {
      return list.concat(groups.cardQty.map((e_cq) => e_cq.asCardRefQty))
    }, Array<CardRefQty>())
  }

  static fromList(refQtyList: Array<CardRefQty>): EncodableDeck {
    const groups = EncodableDeck.groupedBySet(refQtyList)
      .map((g) => EncodableSetGroup.from(g))
    let deck = new EncodableDeck()
    deck.version = 1
    deck.setGroups = groups
    return deck
  }

  private static groupedBySet(refQtyList: Array<CardRefQty>): Array<Array<CardRefQty>> {
    let groups = new Map<RefSetCode, Array<CardRefQty>>()
    for (let rq of refQtyList) {
      const code = new CardRefElements(rq.id).set_code
      let g = groups.get(code)
      if (!g) {
        g = []
        groups.set(code, g)
      }
      g.push(rq)
    }
    return Array.from(groups, ([_, v]) => v)
  }
}

class DecodingContext {
  setCode?: number
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