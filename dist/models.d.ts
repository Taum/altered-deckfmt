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
    Unique = "U",// 3
    Exalt = "E"
}
export declare enum RefSetCode {
    CoreKS = "COREKS",// 1
    Core = "CORE",// 2
    Alize = "ALIZE",// 3
    Bise = "BISE",// 4
    TumultS3 = "TCS3",// 5
    WCQualifier25 = "WCQ25",// 6
    WCSeries25 = "WCS25",// 7
    Cyclone = "CYCLONE",// 8
    Duster = "DUSTER",// 9
    DusterTOP = "DUSTERTOP",// 10
    DusterCB = "DUSTERCB",// 11
    DusterOP = "DUSTEROP",// 12
    Eole = "EOLE",// 13
    EoleCB = "EOLECB",// 14
    Judge = "JUDGE",// 15
    Musubi = "MUSUBI",// 16
    WCFinals25 = "WCF25",// 17
    WCSeries26 = "WCS26"
}
export declare const SetCodeIdBitLengthMap: Record<number, number>;
export declare const SetCodeIdWithLegacyRarityLength: number[];
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
