import { PostAsset } from "./types/PostAsset";
import { Link } from "./types/Link";
import { SocialPost } from "./types/SocialPost";
import { web3 } from "../web3";
import { ArweaveTransaction } from "../arweave/ArweaveTransaction.class";


export class Post  {

    protected readonly _author: string;
    protected readonly _message: string;
    protected readonly _version: string = "0.0.1"; 
    protected readonly _controller: string = "";  
    protected readonly _links: Link[];
    protected readonly _asset: PostAsset | null;
    protected _timestamp:number | undefined;


    constructor(message: string | SocialPost, author?: string, asset?: PostAsset, links?: Link[]) {
        if (typeof message === "string") {
            this._author = author? author : "";
            this._message = message;
            this._links = links? links : [];
            this._asset = asset? asset : null;
        } else {
            this._author = message.LSPXXProfilePost.author;
            this._message = message.LSPXXProfilePost.message;
            this._links = message.LSPXXProfilePost.links;
            this._asset = message.LSPXXProfilePost.asset;
            this._version = message.LSPXXProfilePost.version;
        }

    }

    get author(): string {
        return this._author;
    }

    get message(): string {
        return this._message;
    }

    get object() {
        return {
            version: this._version,
            author: this._author,
            controller: this._controller,
            message: this._message,
            links: this._links? this._links : [],
            asset: this._asset? this._asset : null
        }
    }

    get hash(): string {
        return web3.utils.keccak256(JSON.stringify(this.object));
    }

    get asset():PostAsset | null {
        return this._asset;
    }

    get date():Date | undefined {
        if (this._timestamp) return new Date(this._timestamp * 1000); //Convert from UNIX timestamp
       return undefined;
    }

    get timestamp():number | undefined {
        return this._timestamp;
    }

    set timestamp(timestamp:number | undefined) {
        this._timestamp = timestamp;
    }


    public toJson(): SocialPost{
        let LSPXXProfilePost = this.object;
        let LSPXXProfilePostHash = this.hash;

        return {
            LSPXXProfilePost,
            LSPXXProfilePostHash
        }
    }

    public toData(): Buffer {
        return Buffer.from(JSON.stringify(this.toJson()));
    }

    public byteSize(): number {
        return new TextEncoder().encode(this.toData().toString()).length;
    }

}