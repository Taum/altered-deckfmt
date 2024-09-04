declare global {
    var BITSTREAM_TRACE: Boolean;
}
export interface StringEncodingOptions {
    encoding?: string;
    nullTerminated?: boolean;
}
/**
 * A class which lets you read through one or more Buffers bit-by-bit. All data is read in big-endian (network) byte
 * order
 */
export declare class BitstreamReader {
    private buffers;
    private bufferedLength;
    private blockedRequest;
    private _offsetIntoBuffer;
    private _bufferIndex;
    private _offset;
    private _spentBufferSize;
    /**
     * Get the index of the buffer currently being read. This will always be zero unless retainBuffers=true
     */
    get bufferIndex(): number;
    /**
     * Get the current offset in bits, starting from the very first bit read by this reader (across all
     * buffers added)
     */
    get offset(): number;
    /**
     * The total number of bits which were in buffers that have previously been read, and have since been discarded.
     */
    get spentBufferSize(): number;
    /**
     * Set the current offset in bits, as measured from the very first bit read by this reader (across all buffers
     * added). If the given offset points into a previously discarded buffer, an error will be thrown. See the
     * retainBuffers option if you need to seek back into previous buffers. If the desired offset is in a previous
     * buffer which has not been discarded, the current read head is moved into the appropriate offset of that buffer.
     */
    set offset(value: number);
    /**
     * Run a function which can synchronously read bits without affecting the read head after the function
     * has finished.
     * @param func
     */
    simulateSync<T>(func: () => T): T;
    /**
     * Run a function which can asynchronously read bits without affecting the read head after the function
     * has finished.
     * @param func
     */
    simulate<T>(func: () => Promise<T>): Promise<T>;
    /**
     * When true, buffers are not removed, which allows the user to
     * "rewind" the current offset back into buffers that have already been
     * visited. If you enable this, you will need to remove buffers manually using
     * clean()
     */
    retainBuffers: boolean;
    /**
     * Remove any fully used up buffers. Only has an effect if retainBuffers is true.
     * Optional `count` parameter lets you control how many buffers can be freed.
     */
    clean(count?: number): void;
    /**
     * The number of bits that are currently available.
     */
    get available(): number;
    /**
     * Check if the given number of bits are currently available.
     * @param length The number of bits to check for
     * @returns True if the required number of bits is available, false otherwise
     */
    isAvailable(length: number): boolean;
    private ensureNoReadPending;
    private textDecoder;
    /**
     * Asynchronously read the given number of bytes, encode it into a string, and return the result,
     * optionally using a specific text encoding.
     * @param length The number of bytes to read
     * @param options A set of options to control conversion into a string. @see StringEncodingOptions
     * @returns The resulting string
     */
    readString(length: number, options?: StringEncodingOptions): Promise<string>;
    /**
     * Synchronously read the given number of bytes, encode it into a string, and return the result,
     * optionally using a specific text encoding.
     * @param length The number of bytes to read
     * @param options A set of options to control conversion into a string. @see StringEncodingOptions
     * @returns The resulting string
     */
    readStringSync(length: number, options?: StringEncodingOptions): string;
    /**
     * Read a number of the given bitlength synchronously without advancing
     * the read head.
     * @param length The number of bits to read
     * @returns The number read from the bitstream
     */
    peekSync(length: number): number;
    private skippedLength;
    /**
     * Skip the given number of bits.
     * @param length The number of bits to skip
     */
    skip(length: number): void;
    /**
     * Read an unsigned integer of the given bit length synchronously. If there are not enough
     * bits available, an error is thrown.
     *
     * @param length The number of bits to read
     * @returns The unsigned integer that was read
     */
    readSync(length: number): number;
    /**
     * Read a number of bytes from the stream. Returns a generator that ends when the read is complete,
     * and yields a number of *bytes* still to be read (not bits like in other read methods)
     *
     * @param buffer The buffer/typed array to write to
     * @param offset The offset into the buffer to write to. Defaults to zero
     * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
     */
    readBytes(buffer: Uint8Array, offset?: number, length?: number): Generator<number, any>;
    /**
     * Read a number of bytes from the stream synchronously. If not enough bytes are available, an
     * exception is thrown.
     *
     * @param buffer The buffer/typed array to write to
     * @param offset The offset into the buffer to write to. Defaults to zero
     * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
     */
    readBytesSync(buffer: Uint8Array, offset?: number, length?: number): Uint8Array;
    /**
     * Read a number of bytes from the stream. Blocks and waits for more bytes if not enough bytes are available.
     *
     * @param buffer The buffer/typed array to write to
     * @param offset The offset into the buffer to write to. Defaults to zero
     * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
     */
    readBytesBlocking(buffer: Uint8Array, offset?: number, length?: number): Promise<Uint8Array>;
    /**
     * Read a two's complement signed integer of the given bit length synchronously. If there are not
     * enough bits available, an error is thrown.
     *
     * @param length The number of bits to read
     * @returns The signed integer that was read
     */
    readSignedSync(length: number): number;
    private maskOf;
    /**
     * Read an IEEE 754 floating point value with the given bit length (32 or 64). If there are not
     * enough bits available, an error is thrown.
     *
     * @param length Must be 32 for 32-bit single-precision or 64 for 64-bit double-precision. All
     *        other values result in TypeError
     * @returns The floating point value that was read
     */
    readFloatSync(length: number): number;
    private readByteAligned;
    private consume;
    private readShortByteAligned;
    private readLongByteAligned;
    private read3ByteAligned;
    private readPartialByte;
    /**
     * @param length
     * @param consume
     * @param byteOrder The byte order to use when the length is greater than 8 and is a multiple of 8.
     *                  Defaults to MSB (most significant byte). If the length is not a multiple of 8,
     *                  this is unused
     * @returns
     */
    private readCoreSync;
    private adjustSkip;
    /**
     * Wait until the given number of bits is available
     * @param length The number of bits to wait for
     * @param optional When true, the returned promise will resolve even if the stream ends before all bits are
     *                 available. Otherwise, the promise will reject.
     * @returns A promise which will resolve when the requested number of bits are available. Rejects if the stream
     *          ends before the request is satisfied, unless optional parameter is true.
     */
    assure(length: number, optional?: boolean): Promise<void>;
    /**
     * Read an unsigned integer with the given bit length, waiting until enough bits are
     * available for the operation.
     *
     * @param length The number of bits to read
     * @returns A promise which resolves to the unsigned integer once it is read
     */
    read(length: number): Promise<number>;
    /**
     * Read a two's complement signed integer with the given bit length, waiting until enough bits are
     * available for the operation.
     *
     * @param length The number of bits to read
     * @returns A promise which resolves to the signed integer value once it is read
     */
    readSigned(length: number): Promise<number>;
    private block;
    /**
     * Read an IEEE 754 floating point value with the given bit length, waiting until enough bits are
     * available for the operation.
     *
     * @param length The number of bits to read (must be 32 for 32-bit single-precision or
     *                  64 for 64-bit double-precision)
     * @returns A promise which resolves to the floating point value once it is read
     */
    readFloat(length: number): Promise<number>;
    /**
     * Asynchronously read a number of the given bitlength without advancing the read head.
     * @param length The number of bits to read. If there are not enough bits available
     * to complete the operation, the operation is delayed until enough bits become available.
     * @returns A promise which resolves iwth the number read from the bitstream
     */
    peek(length: number): Promise<number>;
    /**
     * Add a buffer onto the end of the bitstream.
     * @param buffer The buffer to add to the bitstream
     */
    addBuffer(buffer: Uint8Array): void;
    private _ended;
    get ended(): boolean;
    reset(): void;
    /**
     * Inform this reader that it will not receive any further buffers. Any requests to assure bits beyond the end of the
     * buffer will result ss
     */
    end(): void;
    private endOfStreamError;
}
