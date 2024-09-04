import { CardId, CardRefQty } from './models';
import { BitstreamReader, BitstreamWriter } from './bitstream';
export declare class EncodableCard {
    setCode: number;
    product: number | null;
    faction: number;
    numberInFaction: number;
    rarity: number;
    uniqueId: number | undefined;
    static decode(reader: BitstreamReader, context: DecodingContext): EncodableCard;
    encode(writer: BitstreamWriter): void;
    get asCardId(): CardId;
    static fromId(id: CardId): EncodableCard;
}
export declare class EncodableCardQty {
    quantity: number;
    card: EncodableCard;
    static decode(reader: BitstreamReader, context: DecodingContext): EncodableCardQty;
    encode(writer: BitstreamWriter): void;
    get asCardRefQty(): CardRefQty;
    static from(quantity: number, card: CardId): EncodableCardQty;
}
export declare class EncodableSetGroup {
    setCode: number;
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
    private static groupedBySet;
}
declare class DecodingContext {
    setCode?: number;
}
export declare class DecodingError extends Error {
    constructor(message: string);
}
export declare class EncodingError extends Error {
    constructor(message: string);
}
export {};
