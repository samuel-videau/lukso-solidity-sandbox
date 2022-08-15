import { PostAsset } from "./PostAsset";
import { Link } from "./Link";
import { SocialPost } from "./SocialPost";
import { web3 } from "../web3";


export class Post  {

    protected readonly _author: string;
    protected readonly _message: string;
    protected readonly _version: string = "0.0.1"; 
    protected readonly _controller: string = "";  
    protected readonly _links?: Link[];
    protected readonly _asset?: PostAsset | null;

    constructor(message: string, author: string, links?: Link[], asset?: PostAsset) {
        this._author = author;
        this._message = message;
        this._links = links? links : [];
        this._asset = asset? asset : null;

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