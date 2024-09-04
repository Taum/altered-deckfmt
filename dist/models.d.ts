export declare enum RefProduct {
    Booster = "B",// special
    Promo = "P",// 1
    AltArt = "A"
}
export declare enum RefFaction {
    Axiom = "AX",// 1
    Bravos = "BR",// 2
    Lyra = "LY",// 3
    Muna = "MU",// 4
    Ordis = "OR",// 5
    Yzmir = "YZ",// 6
    Neutral = "NE"
}
export declare enum RefRarity {
    Common = "C",// 0
    Rare = "R1",// 1
    RareOOF = "R2",// 2
    Unique = "U"
}
export declare enum RefSetCode {
    CoreKS = "COREKS",// 1
    Core = "CORE"
}
export type CardId = string;
export interface CardRefQty {
    quantity: number;
    id: CardId;
}
export declare class CardRefElements {
    set_code: RefSetCode;
    product: RefProduct;
    faction: RefFaction;
    num_in_faction: number;
    rarity: RefRarity;
    uniq_num?: number;
    constructor(id: CardId);
    get productId(): number | null;
    get factionId(): number;
    get rarityId(): number;
    get setId(): number;
}
