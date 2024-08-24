import { BitstreamElement, Field, ReservedLow } from '@astronautlabs/bitstream';
import { RefSetCode, RefFaction, RefRarity, CardId, CardRefQty, CardRefElements } from './models';
import { BitstreamReader } from '@astronautlabs/bitstream';

// 14bit or 22bit value - range 0 to 1060863 (0x102FFF) inclusive
// from 0 - 0b10 1111 1111 1111 (12287, 0x2FFF) - plain 14 bit value
// over     0b11 0000 0000 0000 (12288, 0x3000) - prefix is 0b11, rest of 20 bits form a number, add 0x3000
// e.g. 12288 = 0b11 0000 ... 0000 0000
//      12289 = 0b11 0000 ... 0000 0001
//      12345 = 0b11 0000 ... 0011 1001 (12345 - 12288 = 57 = 0b111001)
// and so on up to 0b11 1111 ... 1111 = (2*20-1) + 12288 = 1060863 (0xFFFFF + 0x3000 = 0x102FFF)
// export class EncodableExtendedUniqueId extends BitstreamElement {
//   @Field(2, { writtenValue: i => i.simple_number ? (i.simple_number >> 12) : 0b11 }) hiBits: number
//   @Field(12, { presentWhen: i => (i.hiBits < 3 || i.simple_number != undefined) }) simple_number: number | undefined
//   @Field(20, { presentWhen: i => (i.hiBits == 3 || i.large_number != undefined) }) large_number: number | undefined

//   static from(number: number) {
//     let eeui = new EncodableExtendedUniqueId()
//     if (number > 0x102FFF) {
//       throw `unique id is too large ${number}`
//     }
//     if (number <= 0x2FFF) {
//       eeui.simple_number = number
//     } else {
//       eeui.large_number = number - 0x3000
//     }
//     return eeui
//   }

//   get number() {
//     return this.simple_number != undefined ?
//       (this.hiBits << 12) + this.simple_number :
//       (this.large_number + 0x3000)
//   }
// }

export class EncodableCard extends BitstreamElement {
  // @Field(3) faction: number;
  // @Field(5) num_in_faction: number;
  // @Field(2) rarity: number;
  // @Field({ presentWhen: i => i.rarity == 3 }) unique_num: EncodableExtendedUniqueId | undefined;

  // set_code: number;

  // onParseFinished(): void {
  //   this.set_code = (this.parent.parent as EncodableSetGroup).set_code
  // }

  setCode: number
  faction: number
  numberInFaction: number
  rarity: number

  // todo: uniqueId: EncodableUniqueId

  static decode(reader: BitstreamReader, context: DecodingContext) {
    const self = new EncodableCard()
    if (context.setCode === undefined) {
      throw new DecodingError("Trying to decode Card without SetCode in context")
    }
    self.setCode = context.setCode 
    self.faction = reader.readSync(3)
    self.numberInFaction = reader.readSync(5)
    self.rarity = reader.readSync(2)
    return self
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
      //case 3: id += RefRarity.Unique + "_" + this.unique_num.number; break;
    }
    return id
  }

  static fromId(id: CardId): EncodableCard {
    let ec = new EncodableCard()
    let refEls = new CardRefElements(id)
    ec.faction = refEls.factionId
    ec.numberInFaction = refEls.num_in_faction
    ec.rarity = refEls.rarityId
    // ec.unique_num = EncodableExtendedUniqueId.from(refEls.uniq_num)
    return ec
  }
}

export class EncodableCardQty {
  // @Field(2, { writtenValue: i => i.quantity > 3 ? 0 : i.quantity }) quantity: number;
  // @Field(6, { presentWhen: i => (i.quantity == 0 || i.quantity > 3), writtenValue: i => i.quantity > 3 ? i.quantity - 3 : 0 }) extended_quantity?: number;
  // @Field() card: EncodableCard;

  // static from(quantity: number, card: CardId): EncodableCardQty {
  //   let ecq = new EncodableCardQty()
  //   ecq.quantity = quantity
  //   ecq.card = EncodableCard.fromId(card)
  //   return ecq
  // }

  quantity: number
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

  get asCardRefQty(): CardRefQty {
    return {
      quantity: this.quantity,
      id: this.card!.asCardId
    }
  }
}

export class EncodableSetGroup {
  // @Field(8) set_code: number;
  // @Field({ array: { type: EncodableCardQty, countFieldLength: 6 } }) cardQty: Array<EncodableCardQty>;

  // static from(rqs: CardRefQty[], hasMore: boolean) {
  //   let esg = new EncodableSetGroup()
  //   esg.set_code = new CardRefElements(rqs[0].id).setId
  //   esg.cardQty = rqs.map((rq) => EncodableCardQty.from(rq.quantity, rq.id))
  //   return esg
  // }

  setCode: number
  cardRefCount: number
  cardQty: EncodableCardQty[]

  static decode(reader: BitstreamReader, context: DecodingContext): EncodableSetGroup {
    const self = new EncodableSetGroup()
    self.setCode = reader.readSync(8)
    context.setCode = self.setCode

    self.cardRefCount = reader.readSync(6)
    const cards = new Array<EncodableCardQty>()
    for (let i = 0 ; i < self.cardRefCount ; i++) {
      cards.push(EncodableCardQty.decode(reader, context))
    }
    self.cardQty = cards
    context.setCode = undefined

    return self
  }
}

export class EncodableDeck {
  // @Field(4) format_version: number;
  // @Field({ array: { type: EncodableSetGroup, countFieldLength: 8 } }) set_groups: Array<EncodableSetGroup>;
  // @ReservedLow(i => (8 - (i.measure() % 8))) padding: number;

  version: number
  groupsCount: number
  setGroups: EncodableSetGroup[]

  static decode(reader: BitstreamReader): EncodableDeck {
    const self = new EncodableDeck()
    const context = new DecodingContext()
    self.version = reader.readSync(4)
    if (self.version !== 1) {
      throw new DecodingError("Invalid version");
    }
    self.groupsCount = reader.readSync(8)
    console.log("groupsCount: ", self.groupsCount)
    
    const groups = new Array<EncodableSetGroup>()
    for (let i = 0 ; i < self.groupsCount ; i++) {
      groups.push(EncodableSetGroup.decode(reader, context))
    }
    self.setGroups = groups
    return self
  }

  // static fromList(refQtyList: Array<CardRefQty>): EncodableDeck {
  //   const groups = EncodableDeck.groupedBySet(refQtyList)
  //     .map((g, i, a) => EncodableSetGroup.from(g, i < a.length - 1))
  //   let deck = new EncodableDeck()
  //   deck.version = 1
  //   deck.setGroups = groups
  //   return deck
  // }

  get asCardRefQty(): Array<CardRefQty> {
    return this.setGroups.reduce((list, groups) => {
      return list.concat(groups.cardQty.map((e_cq) => e_cq.asCardRefQty))
    }, Array<CardRefQty>())
  }

  // private static groupedBySet(refQtyList: Array<CardRefQty>): Array<Array<CardRefQty>> {
  //   let groups = new Map<RefSetCode, Array<CardRefQty>>()
  //   for (let rq of refQtyList) {
  //     const code = new CardRefElements(rq.id).set_code
  //     let g = groups.get(code)
  //     if (!g) {
  //       g = []
  //       groups.set(code, g)
  //     }
  //     g.push(rq)
  //   }
  //   return Array.from(groups, ([_, v]) => v)
  // }
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