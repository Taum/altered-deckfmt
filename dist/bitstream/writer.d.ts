export interface Writable {
    write(chunk: Uint8Array): void;
}
export declare class BufferedWritable implements Writable {
    buffer: Uint8Array;
    write(chunk: Uint8Array): void;
}
/**
 * A class for writing numbers of varying bitlengths to a Node.js Writable.
 * All data is written in big-endian (network) byte order.
 */
export declare class BitstreamWriter {
    stream: Writable;
    readonly bufferSize: number;
    /**
     * Create a new writer
     * @param stream The writable stream to write to
     * @param bufferSize The number of bytes to buffer before flushing onto the writable
     */
    constructor(stream: Writable, bufferSize?: number);
    private pendingByte;
    private pendingBits;
    private buffer;
    private bufferedBytes;
    private _offset;
    /**
     * How many bits have been written via this writer in total
     */
    get offset(): number;
    /**
     * How many bits into the current byte is the write cursor.
     * If this value is zero, then we are currently byte-aligned.
     * A value of 7 means we are 1 bit away from the byte boundary.
     */
    get byteOffset(): number;
    /**
     * Finish the current byte (assuming zeros for the remaining bits, if necessary)
     * and flushes the output.
     */
    end(): void;
    /**
     * Reset the bit offset of this writer back to zero.
     */
    reset(): void;
    private finishByte;
    flush(): void;
    private min;
    /**
     * Write the given number to the bitstream with the given bitlength. If the number is too large for the
     * number of bits specified, the lower-order bits are written and the higher-order bits are ignored.
     * @param length The number of bits to write
     * @param value The number to write
     */
    write(length: number, value: number): void;
}
