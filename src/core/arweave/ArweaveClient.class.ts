import _arweaveWallet from "./arweaveAddress.json";
import Arweave from "arweave";
import { JWK } from "./JWK";
import { Tag } from "../Post/Tag";

export class ArweaveClient {
    protected readonly _urlPrefix = "ar://";
    protected readonly _provider;
    protected readonly _wallet;
    public readonly ARID = 5632;

    constructor () {
        this._provider = Arweave.init({});
        this._wallet = _arweaveWallet;
    }

    public async upload(data:Buffer, tags:Tag[]):Promise<string> {
        let tx = await this._provider.createTransaction({
            data: data
        }, (await this._wallet));
        // Add Tags if there are any
        if (tags) {
        tags.forEach((tag) => {
            tx.addTag(tag.key, tag.value)
        }) 
        }
        // Sign
        await this._provider.transactions.sign(tx, this._wallet);

        const response = await this._provider.transactions.post(tx);
        console.log(response);
        switch (response.status) {
            case 200:
                console.log("Transaction " + tx.id + " submitted sucessfully");
                console.log(response);
                return tx.id;
            default:
                throw new Error("uploadPost: Failed to upload post data")
        }
    }

    public async download(txId:string) {

    }

    public async getTxTags(txId:string): Promise<any> {
        let response = await fetch(`https://arweave.net/tx/${txId}/tags`);
        return response.json();
    }

    get urlPrefix(): string {
        return this._urlPrefix;
    }

    get wallet(): JWK{
        return this._wallet;
    }

    public async estimateCost(byteSize:number): Promise<string> {
        const response = await this._provider.api.get(`/price/${byteSize}`);
        switch (response.status) {
            case 200:
                console.log(response.data);
                return response.data;
            default:
                throw new Error("Request failed: estimateCost")
        }
    }

    public async winstonToDollar (valueInWinston: string) {
        return this.arToDollar(this._provider.ar.winstonToAr(valueInWinston));
    }
    
    public async arToDollar (valueInAR: string) {
        let headers = new Headers({'X-CMC_PRO_API_KEY':'b3042fe3-7f38-4787-847e-b72fa17657b0'});

        let response:any = {}
        try {
          response = await fetch(`https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=${valueInAR}&id=${this.ARID}`, {headers});
        } catch (error: any) {
          return error.message? error.message :  "Error: Unable to convert to arToDollar";
        }
        return (await response.json()).data.quote.USD.price
    }
    
    
}