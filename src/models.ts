export enum RefProduct {
  Booster = "B", // special
  // 0 = invalid
  Promo = "P",   // 1
  AltArt = "A",  // 2
}

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
  CoreKS = "COREKS",       // 1
  Core = "CORE",           // 2
  Alize = "ALIZE",         // 3
  Bise = "BISE",   	       // 4
  TumultS3 = "TCS3",       // 5
  WCQualifier25 = "WCQ25", // 6
  WCSeries25 = "WCS25",    // 7
  Cyclone = "CYCLONE",     // 8
}

export const SetCodeIdBitLengthMap: Record<number, number> = {
  1: 5, // CoreKS        range 0-31
  2: 5, // Core          range 0-31
  3: 6, // Alize         range 0-63
  4: 6, // Bise          range 0-63
  5: 6, // TumultS3      range 0-63
  6: 5, // WCQualifier25 range 0-31
  7: 5, // WCSeries25    range 0-31
  8: 7, // Cyclone       range 0-127
}

export type CardId = string

export interface CardRefQty {
  quantity: number
  id: CardId
}

export class CardRefElements {
  set_code: RefSetCode
  product: RefProduct
  faction: RefFaction
  num_in_faction: number
  rarity: RefRarity
  uniq_num?: number

  constructor(id: CardId) {
    const match = id.match(/^ALT_(\w+)_(A|B|P)_(\w{2})_(\d{1,2})_(C|R1|R2|U)(?:_(\d+))?$/)
    if (!match) { throw "unrecognized card id '" + id + "'" }

    this.set_code = (match[1] as RefSetCode)
    this.product = (match[2] as RefProduct)
    this.faction = (match[3] as RefFaction)
    this.num_in_faction = parseInt(match[4], 10)
    this.rarity = (match[5] as RefRarity)
    this.uniq_num = (match[6] ? parseInt(match[6]) : undefined)

    if (this.rarity == RefRarity.Unique && this.uniq_num == undefined) {
      throw "unique card is missing a unique_number"
    }
  }

  get productId(): number | null {
    switch (this.product) {
      case RefProduct.Booster: return null;
      case RefProduct.Promo: return 1;
      case RefProduct.AltArt: return 2;
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
      case RefSetCode.CoreKS: return 1;
      case RefSetCode.Core: return 2;
      case RefSetCode.Alize: return 3;
      case RefSetCode.Bise: return 4;
      case RefSetCode.TumultS3: return 5;
      case RefSetCode.WCQualifier25: return 6;
      case RefSetCode.WCSeries25: return 7;
      case RefSetCode.Cyclone: return 8;
    }
    throw `Unrecognized SetCode ${this.set_code}`
  }
}