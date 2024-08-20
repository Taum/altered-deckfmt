import { BitstreamElement, Field, ReservedLow } from '@astronautlabs/bitstream';
import { RefSetCode, RefFaction, RefRarity, CardId, CardRefQty, CardRefElements } from './models';

import "reflect-metadata";

// 14bit or 22bit value - range 0 to 1060863 (0x102FFF) inclusive
// from 0 - 0b10 1111 1111 1111 (12287, 0x2FFF) - plain 14 bit value
// over     0b11 0000 0000 0000 (12288, 0x3000) - prefix is 0b11, rest of 20 bits form a number, add 0x3000
// e.g. 12288 = 0b11 0000 ... 0000 0000
//      12289 = 0b11 0000 ... 0000 0001
//      12345 = 0b11 0000 ... 0011 1001 (12345 - 12288 = 57 = 0b111001)
// and so on up to 0b11 1111 ... 1111 = (2*20-1) + 12288 = 1060863 (0xFFFFF + 0x3000 = 0x102FFF)
export class EncodableExtendedUniqueId extends BitstreamElement {
  @Field(2, { writtenValue: i => i.simple_number ? (i.simple_number >> 12) : 0b11 }) hiBits: number
  @Field(12, { presentWhen: i => (i.hiBits < 3 || i.simple_number != undefined) }) simple_number: number | undefined
  @Field(20, { presentWhen: i => (i.hiBits == 3 || i.large_number != undefined) }) large_number: number | undefined

  static from(number: number) {
    let eeui = new EncodableExtendedUniqueId()
    if (number > 0x102FFF) {
      throw `unique id is too large ${number}`
    }
    if (number <= 0x2FFF) {
      eeui.simple_number = number
    } else {
      eeui.large_number = number - 0x3000
    }
    return eeui
  }

  get number() {
    return this.simple_number != undefined ?
      (this.hiBits << 12) + this.simple_number :
      (this.large_number + 0x3000)
  }
}

export class EncodableCard extends BitstreamElement {
  @Field(3) faction: number;
  @Field(5) num_in_faction: number;
  @Field(2) rarity: number;
  @Field({ presentWhen: i => i.rarity == 3 }) unique_num: EncodableExtendedUniqueId | undefined;

  set_code: number;

  onParseFinished(): void {
    this.set_code = (this.parent.parent as EncodableSetGroup).set_code
  }

  get asCardId(): CardId {
    let id = "ALT_"
    switch (this.set_code) {
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
    if (this.num_in_faction < 10 && this.faction != 7) {
      // Fun fact: Neutral card (Mana Orb) does not use 0 prefix
      id += "0"
    }
    id += this.num_in_faction
    id += "_"
    switch (this.rarity) {
      case 0: id += RefRarity.Common; break;
      case 1: id += RefRarity.Rare; break;
      case 2: id += RefRarity.RareOOF; break;
      case 3: id += RefRarity.Unique + "_" + this.unique_num.number; break;
    }
    return id
  }

  static fromId(id: CardId): EncodableCard {
    let ec = new EncodableCard()
    let refEls = new CardRefElements(id)
    ec.faction = refEls.factionId
    ec.num_in_faction = refEls.num_in_faction
    ec.rarity = refEls.rarityId
    ec.unique_num = EncodableExtendedUniqueId.from(refEls.uniq_num)
    return ec
  }
}

export class EncodableCardQty extends BitstreamElement {
  @Field(2, { writtenValue: i => i.quantity > 3 ? 0 : i.quantity }) quantity: number;
  @Field(6, { presentWhen: i => (i.quantity == 0 || i.quantity > 3), writtenValue: i => i.quantity > 3 ? i.quantity - 3 : 0 }) extended_quantity?: number;
  @Field() card: EncodableCard;

  static from(quantity: number, card: CardId): EncodableCardQty {
    let ecq = new EncodableCardQty()
    ecq.quantity = quantity
    ecq.card = EncodableCard.fromId(card)
    return ecq
  }

  get asCardRefQty(): CardRefQty {
    return {
      quantity: this.extended_quantity && this.extended_quantity > 0 ? this.extended_quantity + 3 : this.quantity,
      id: this.card!.asCardId
    }
  }
}

export class EncodableSetGroup extends BitstreamElement {
  @Field(7) set_code: number;
  @Field(1) has_more_groups: boolean;
  @Field({ array: { type: EncodableCardQty, countFieldLength: 6 } }) cardQty: Array<EncodableCardQty>;

  static from(rqs: CardRefQty[], hasMore: boolean) {
    let esg = new EncodableSetGroup()
    esg.set_code = new CardRefElements(rqs[0].id).setId
    esg.cardQty = rqs.map((rq) => EncodableCardQty.from(rq.quantity, rq.id))
    esg.has_more_groups = hasMore
    return esg
  }
}

export class EncodableDeck extends BitstreamElement {
  @Field(4) format_version: number;
  @Field({ array: { type: EncodableSetGroup, hasMore: a => a.length > 0 ? a[a.length - 1].has_more_groups : true } }) set_groups: Array<EncodableSetGroup>;
  @ReservedLow(i => (8 - (i.measure() % 8))) padding: number;

  static fromList(refQtyList: Array<CardRefQty>): EncodableDeck {
    const groups = EncodableDeck.groupedBySet(refQtyList)
      .map((g, i, a) => EncodableSetGroup.from(g, i < a.length - 1))
    let deck = new EncodableDeck()
    deck.format_version = 1
    deck.set_groups = groups
    return deck
  }

  get asCardRefQty(): Array<CardRefQty> {
    return this.set_groups.reduce((list, groups) => {
      return list.concat(groups.cardQty.map((e_cq) => e_cq.asCardRefQty))
    }, Array<CardRefQty>())
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