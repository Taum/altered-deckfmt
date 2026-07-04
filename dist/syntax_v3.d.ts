import { CardId, CardRefQty } from './models';
import { BitstreamReader, BitstreamWriter } from './bitstream';
export declare class EncodableCard {
    setCodeId: number;
    setCodeName: string;
    product: number | null;
    faction: number;
    numberInFaction: number;
    rarity: number;
    uniqueId: number | undefined;
    static decode(reader: BitstreamReader, context: DecodingContext, isFirstCard: boolean): EncodableCard;
    encode(writer: BitstreamWriter, familyIdMin: number, familyIdBitLength: number, isFirstCard: boolean): void;
    get asCardId(): CardId;
    static fromId(id: CardId): EncodableCard;
}
export declare class EncodableCardQty {
    quantity: number;
    card: EncodableCard;
    static decode(reader: BitstreamReader, context: DecodingContext, isFirstCard: boolean): EncodableCardQty;
    encode(writer: BitstreamWriter, familyIdMin: number, familyIdBitLength: number, isFirstCard: boolean): void;
    get asCardRefQty(): CardRefQty;
    static from(quantity: number, card: CardId): EncodableCardQty;
}
export declare class EncodableSetGroup {
    setCodeName: string;
    setCodeId: number;
    cardQty: EncodableCardQty[];
    static decode(reader: BitstreamReader, context: DecodingContext): EncodableSetGroup;
    encode(writer: BitstreamWriter): void;
    static from(rqs: CardRefQty[]): EncodableSetGroup;
}
export declare class EncodableDeck {
    version: number;
    setGroups: EncodableSetGroup[];
    static decode(reader: BitstreamReader): EncodableDeck;
    encode(writer: BitstreamWriter): void;
    get asCardRefQty(): Array<CardRefQty>;
    static fromList(refQtyList: Array<CardRefQty>): EncodableDeck;
    private static groupedBySetName;
}
export declare class DecodingContext {
    setCodeName?: string;
    setCodeId?: number;
    familyIdMin?: number;
    familyIdBitLength?: number;
}
export declare class DecodingError extends Error {
    constructor(message: string);
}
export declare class EncodingError extends Error {
    constructor(message: string);
}
