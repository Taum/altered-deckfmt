import { CardId, CardRefQty } from './models';
import { BitstreamReader, BitstreamWriter } from './bitstream';
export declare class EncodableEntry {
    faction: number;
    numberInFaction: number;
    wireRarity: number;
    uniqueWord: number | undefined;
    static decode(reader: BitstreamReader, factionId: number): EncodableEntry;
    encode(writer: BitstreamWriter): void;
    get asCardId(): CardId;
    static fromId(id: CardId): EncodableEntry;
}
export declare class EncodableEntryQty {
    quantity: number;
    entry: EncodableEntry;
    static decode(reader: BitstreamReader, allQtyOne: boolean, factionId: number): EncodableEntryQty;
    encode(writer: BitstreamWriter, allQtyOne: boolean): void;
    get asCardRefQty(): CardRefQty;
    static from(quantity: number, card: CardId): EncodableEntryQty;
}
export declare class EncodableFactionGroup {
    factionId: number;
    entries: EncodableEntryQty[];
    static decode(reader: BitstreamReader, allQtyOne: boolean): EncodableFactionGroup;
    encode(writer: BitstreamWriter, allQtyOne: boolean): void;
    static from(entries: EncodableEntryQty[]): EncodableFactionGroup;
}
export declare class EncodableDeckCompact {
    version: number;
    allQtyOne: boolean;
    factionGroups: EncodableFactionGroup[];
    static decode(reader: BitstreamReader): EncodableDeckCompact;
    encode(writer: BitstreamWriter): void;
    get asCardRefQty(): Array<CardRefQty>;
    static fromList(refQtyList: Array<CardRefQty>): EncodableDeckCompact;
}
export declare class DecodingError extends Error {
    constructor(message: string);
}
export declare class EncodingError extends Error {
    constructor(message: string);
}
