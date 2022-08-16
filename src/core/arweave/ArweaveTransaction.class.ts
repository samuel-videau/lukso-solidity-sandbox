import { Tag } from "../SocialMedia/types/Tag";

export abstract class ArweaveTransaction {

    protected abstract readonly _tags?:Tag[];
    protected _txId:string;

    constructor (txId?:string) {
        this._txId = txId? txId : "" ;
    }

    get txId():string {
        return this._txId;
    }

    get url(): string {
        return "ar://"+this._txId;
    }

    set txId(txId:string) {
        this._txId = txId;
    }
}