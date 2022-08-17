import { web3 } from "../web3";

export class Image  {

    protected readonly _file: File;
    protected readonly _hashFunction:string = "keccak256";


    constructor(file:File) {
        this._file=file;
    }

    get hashFunction():string {
        return this._hashFunction;
    }

    get file():File {
        return this._file;
    }

    public async hash():Promise<string> { // TODO: correctly compute the hash over the data stream
        return web3.utils.keccak256(await this._file.text());
    }

    public async toData():Promise<Buffer> {
        return Buffer.from(await this._file.arrayBuffer());
    } 

    public byteSize(): number {
        return new TextEncoder().encode(this.toData().toString()).length;
    }

}