export enum RefFaction {
  // 0 = invalid
  Axiom = "AX",  // 1
  Bravos = "BR", // 2
  Lyra = "LY",   // 3
  Muna = "MU",   // 4
  Ordis = "OR",  // 5
  Yzmir = "YZ",  // 6
  Neutral = "NE",// 7
}

export enum RefRarity {
  Common = "C",   // 0
  Rare = "R1",    // 1
  RareOOF = "R2", // 2
  Unique = "U",   // 3
}

export enum RefSetCode {
  // 0 = invalid
  Core = "CORE",     // 1
  CoreKS = "COREKS", // 2
}

export type CardId = string

export interface CardRefQty {
  quantity: number
  id: CardId
}

export class CardRefElements {
  set_code: RefSetCode
  b_p: number
  faction: RefFaction
  num_in_faction: number
  rarity: RefRarity
  uniq_num?: number

  constructor(id: CardId) {
    const match = id.match(/^ALT_(\w+)_(B|P)_(\w{2})_(\d{2})_(C|R1|R2|U_(\d+))$/)
    if (!match) { throw "unrecognized card id" }

    this.set_code = (match[1] as RefSetCode)
    this.b_p = match[2] == "B" ? 0 : 1
    this.faction = (match[3] as RefFaction)
    this.num_in_faction = parseInt(match[4], 10)
    this.rarity = (match[5] as RefRarity)
    this.uniq_num = (match[6] ? parseInt(match[6]) : undefined)

    if (this.rarity == RefRarity.Unique && this.uniq_num == undefined) {
      throw "unique card is missing a unique_number"
    }
  }

  get factionId(): number {
    switch (this.faction) {
      case RefFaction.Axiom: return 1;
      case RefFaction.Bravos: return 2;
      case RefFaction.Lyra: return 3;
      case RefFaction.Muna: return 4;
      case RefFaction.Ordis: return 5;
      case RefFaction.Yzmir: return 6;
      case RefFaction.Neutral: return 7;
    }
    throw `Unrecognized Faction ${this.faction}`
  }
  get rarityId(): number {
    switch (this.rarity) {
      case RefRarity.Common: return 0;
      case RefRarity.Rare: return 1;
      case RefRarity.RareOOF: return 2;
      case RefRarity.Unique: return 3;
    }
    throw `Unrecognized Rarity ${this.rarity}`
  }
  get setId(): number {
    switch (this.set_code) {
      case RefSetCode.Core: return 1;
      case RefSetCode.CoreKS: return 2;
    }
    throw `Unrecognized SetCode ${this.rarity}`
  }
}