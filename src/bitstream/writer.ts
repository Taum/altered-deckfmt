// Extracted from https://github.com/astronautlabs/bitstream

import { Buffer } from 'buffer'

export interface Writable {
    write(chunk: Uint8Array): void;
}

export class BufferedWritable implements Writable {
    buffer : Uint8Array = new Uint8Array(0);
    write(chunk : Uint8Array) {
        let buf = new Uint8Array(this.buffer.length + chunk.length);
        buf.set(this.buffer);
        buf.set(chunk, this.buffer.length);
        this.buffer = buf;
    };
}

/**
 * A class for writing numbers of varying bitlengths to a Node.js Writable. 
 * All data is written in big-endian (network) byte order.
 */
export class BitstreamWriter {
    /**
     * Create a new writer
     * @param stream The writable stream to write to
     * @param bufferSize The number of bytes to buffer before flushing onto the writable
     */
    constructor(public stream : Writable, readonly bufferSize = 1) {
        this.buffer = new Uint8Array(bufferSize);
    }

    private pendingByte : bigint = BigInt(0);
    private pendingBits : number = 0;
    private buffer : Uint8Array;
    private bufferedBytes = 0;
    private _offset = 0;

    /**
     * How many bits have been written via this writer in total
     */
    get offset() {
        return this._offset;
    }

    /**
     * How many bits into the current byte is the write cursor.
     * If this value is zero, then we are currently byte-aligned.
     * A value of 7 means we are 1 bit away from the byte boundary.
     */
    get byteOffset() {
        return this.pendingBits;
    }

    /**
     * Finish the current byte (assuming zeros for the remaining bits, if necessary)
     * and flushes the output.
     */
    end() {
        this.finishByte();
        this.flush();
    }

    /**
     * Reset the bit offset of this writer back to zero.
     */
    reset() {
        this._offset = 0;
    }

    private finishByte() {
        if (this.pendingBits > 0) {
            this.buffer[this.bufferedBytes++] = Number(this.pendingByte);
            this.pendingBits = 0;
            this.pendingByte = BigInt(0);
        }
    }
    
    flush() {
        if (this.bufferedBytes > 0) {
            this.stream.write(Buffer.from(this.buffer.slice(0, this.bufferedBytes)));
            this.bufferedBytes = 0;
        }
    }
    
    private min(a : bigint, b : bigint) {
        if (a < b)
            return a;
        else
            return b;
    }

    /**
     * Write the given number to the bitstream with the given bitlength. If the number is too large for the 
     * number of bits specified, the lower-order bits are written and the higher-order bits are ignored.
     * @param length The number of bits to write
     * @param value The number to write
     */
    write(length : number, value : number) {
        if (value === void 0 || value === null)
            value = 0;
        
        value = Number(value);

        if (Number.isNaN(value))
            throw new Error(`Cannot write to bitstream: Value ${value} is not a number`);
        if (!Number.isFinite(value))
            throw new Error(`Cannot write to bitstream: Value ${value} must be finite`);

        let valueN = BigInt(value % Math.pow(2, length));
        
        let remainingLength = length;

        while (remainingLength > 0) {
            let shift = BigInt(8 - this.pendingBits - remainingLength);
            let contribution = (shift >= 0 ? (valueN << shift) : (valueN >> -shift));
            let writtenLength = Number(shift >= 0 ? remainingLength : this.min(-shift, BigInt(8 - this.pendingBits)));

            this.pendingByte = this.pendingByte | contribution;
            this.pendingBits += writtenLength;
            this._offset += writtenLength;
            
            remainingLength -= writtenLength;
            valueN = valueN % BigInt(Math.pow(2, remainingLength));

            if (this.pendingBits === 8) {
                this.finishByte();

                if (this.bufferedBytes >= this.buffer.length) {
                    this.flush();
                }
            }
        }
    }
}
