import { Post } from "../SocialMedia/Post.class";
import { Tag } from "../SocialMedia/types/Tag";
import { ArweaveTransaction } from "./ArweaveTransaction.class";

export class ArweaveObject extends ArweaveTransaction {
    protected readonly _object:any;
    protected readonly _type:string = "json"
    protected readonly _tags = [
        {name:"Content-Type", value:"application/json"},
        {name:"App-Name", value:"Lookso"}
    ];

    constructor( object:any, txId?:string, tags?:Tag[]) {
        super(txId);
        tags?.forEach((tag) => { tags.push(tag)})
        this._object = object;
    }

    get object(): Post {
        return this._object;
    }

    get tags(): Tag[] {
        return this._tags;
    }

}